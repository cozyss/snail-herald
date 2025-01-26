"use client";

import { Fragment, useState, useEffect, useRef } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { api } from "@/trpc/react";
import { colors } from "@/styles/colors";

interface UserAutocompleteProps {
  authToken: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function UserAutocomplete({
  authToken,
  value,
  onChange,
  error,
}: UserAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce the search query to reduce API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300); // Wait 300ms before updating the search query

    return () => clearTimeout(timer);
  }, [query]);

  // Handle clicks outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchQuery = api.searchUsers.useQuery(
    { authToken, query: debouncedQuery },
    {
      enabled: !!authToken,
      staleTime: 30000, // Cache results for 30 seconds
      cacheTime: 60000, // Keep unused data in cache for 1 minute
    },
  );

  const filteredUsers = searchQuery.data ?? [];

  return (
    <div className="relative w-full" ref={containerRef}>
      <Combobox value={value} onChange={onChange}>
        <div className="relative w-full">
          <Combobox.Input
            className={`w-full rounded-md border ${
              error ? colors.border.input.error : colors.border.input.normal
            } p-2 transition-colors duration-200 focus:outline-none ${
              colors.border.input.focus
            } focus:ring-2 focus:ring-offset-2`}
            placeholder="Enter username"
            displayValue={(username: string) => username}
            onChange={(event) => {
              setQuery(event.target.value);
              onChange(event.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
          />
          <Transition
            as={Fragment}
            show={isOpen && filteredUsers.length > 0}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Combobox.Options 
              className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
              static
            >
              {filteredUsers.map((username) => (
                <Combobox.Option
                  key={username}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2.5 pl-4 pr-4 transition-colors duration-150 ${
                      active
                        ? `${colors.background.hover.card} ${colors.text.blue.primary} font-medium`
                        : colors.text.primary
                    }`
                  }
                  value={username}
                >
                  {({ selected }) => (
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {username}
                    </span>
                  )}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
      {error && (
        <p className={`mt-1 text-sm ${colors.text.error}`}>{error}</p>
      )}
    </div>
  );
}

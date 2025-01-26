"use client";

import { Fragment, useState } from "react";
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

  const searchQuery = api.searchUsers.useQuery(
    { authToken, query },
    {
      enabled: !!authToken,
    }
  );

  const filteredUsers = searchQuery.data ?? [];

  return (
    <div className="relative w-full">
      <Combobox value={value} onChange={onChange}>
        <div className="relative w-full">
          <Combobox.Input
            className={`w-full rounded-md border ${error ? colors.border.input.error : colors.border.input.normal} p-2`}
            placeholder="Enter username (type a new username or select from your contacts)"
            displayValue={(username: string) => username}
            onChange={(event) => {
              setQuery(event.target.value);
              onChange(event.target.value);
            }}
            onFocus={() => setIsOpen(true)}
            onBlur={() => {
              setTimeout(() => setIsOpen(false), 200);
            }}
          />
          <Transition
            as={Fragment}
            show={isOpen && filteredUsers.length > 0}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredUsers.map((username) => (
                <Combobox.Option
                  key={username}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-4 pr-4 ${
                      active ? `${colors.background.primary} ${colors.text.white}` : colors.text.primary
                    }`
                  }
                  value={username}
                >
                  {({ selected, active }) => (
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                      {username}
                    </span>
                  )}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
      {error && <p className={`mt-1 text-sm ${colors.text.error}`}>{error}</p>}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { UserAutocomplete } from "@/components/UserAutocomplete";
import { api } from "@/trpc/react";
import toast from "react-hot-toast";
import { NavigationBar } from "@/components/NavigationBar";
import { LetterItem } from "@/components/LetterItem";
import { Tab } from "@headlessui/react";
import { colors } from "@/styles/colors";

export default function HomePage() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [authToken, setAuthToken] = useState<string>("");

  // Initialize user data from localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedIsAdmin = localStorage.getItem("isAdmin") === "true";
    const storedAuthToken = localStorage.getItem("authToken");

    if (!storedUsername || !storedAuthToken) {
      router.push("/login");
      return;
    }

    setUsername(storedUsername);
    setIsAdmin(storedIsAdmin);
    setAuthToken(storedAuthToken);
  }, [router]);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      receiverUsername: "",
      content: "",
    },
  });

  const messagesQuery = api.getUserMessages.useQuery(
    { authToken },
    {
      enabled: !!authToken,
    }
  );

  const sendMessageMutation = api.sendMessage.useMutation({
    onSuccess: () => {
      toast.success("Letter sent successfully!");
      setValue("receiverUsername", "");
      setValue("content", "");
      messagesQuery.refetch();
    },
    onError: (error) => {
      if (error.message.includes("User not found")) {
        toast.error("The recipient username does not exist. Please check the username and try again.");
      } else {
        toast.error(error.message);
      }
    },
  });

  const markAllMessagesAsReadMutation = api.markAllMessagesAsRead.useMutation({
    onSuccess: () => {
      messagesQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = handleSubmit((data) => {
    sendMessageMutation.mutate({
      authToken,
      receiverUsername: data.receiverUsername,
      content: data.content,
    });
  });

  const handleMessageRead = () => {
    messagesQuery.refetch();
  };

  const hasUnreadMessages = messagesQuery.data?.receivedMessages.some(
    (message) => !message.isRead && new Date(message.visibleAt) <= new Date()
  );

  if (!username || !authToken) {
    return null;
  }

  return (
    <div>
      <NavigationBar username={username} isAdmin={isAdmin} />
      <div className="container mx-auto max-w-4xl p-4">
        <div className={`mb-8 rounded-lg ${colors.background.card} p-6 ${colors.shadow.sm}`}>
          <h2 className={`${colors.text.primary} text-xl font-bold`}>Send a Letter</h2>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <UserAutocomplete
                authToken={authToken}
                value={watch("receiverUsername") || ""}
                onChange={(value) => setValue("receiverUsername", value)}
                error={errors.receiverUsername?.message}
              />
            </div>
            <div>
              <textarea
                {...register("content", {
                  required: "Letter content is required",
                })}
                className={`w-full rounded-md border ${colors.border.input.normal} p-2`}
                rows={3}
                placeholder="Type your letter here..."
              />
              {errors.content && (
                <p className={`mt-1 text-sm ${colors.text.error}`}>
                  {errors.content.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={sendMessageMutation.isPending}
              className={`rounded-md ${colors.background.primary} px-4 py-2 ${colors.text.white} ${colors.interactive.hover.bg.blue} ${colors.background.disabled}`}
            >
              {sendMessageMutation.isPending ? "Sending..." : "Send Letter"}
            </button>
          </form>
        </div>

        <div className={`rounded-lg ${colors.background.card} p-6 ${colors.shadow.sm}`}>
          <h2 className={`${colors.text.primary} text-xl font-bold`}>Letters</h2>
          {messagesQuery.isPending ? (
            <p>Loading letters...</p>
          ) : messagesQuery.error ? (
            <p className={colors.text.error}>Error loading letters</p>
          ) : (
            <Tab.Group defaultIndex={0}>
              <Tab.List className="mb-4 flex space-x-2 border-b">
                <Tab
                  className={({ selected }) =>
                    `relative px-4 py-2 focus:outline-none ${
                      selected
                        ? `border-b-2 ${colors.text.blue.primary} border-blue-500`
                        : `${colors.text.muted} ${colors.interactive.hover.text.blue}`
                    }`
                  }
                >
                  Received Letters
                  {hasUnreadMessages && (
                    <span className={`absolute -right-1 -top-1 h-3 w-3 rounded-full ${colors.background.primary}`} />
                  )}
                </Tab>
                <Tab
                  className={({ selected }) =>
                    `px-4 py-2 focus:outline-none ${
                      selected
                        ? `border-b-2 ${colors.text.blue.primary} border-blue-500`
                        : `${colors.text.muted} ${colors.interactive.hover.text.blue}`
                    }`
                  }
                >
                  Sent Letters
                </Tab>
              </Tab.List>
              <Tab.Panels>
                <Tab.Panel>
                  <div className="mb-4 flex justify-end">
                    <button
                      onClick={() => {
                        markAllMessagesAsReadMutation.mutate({ authToken });
                      }}
                      disabled={markAllMessagesAsReadMutation.isPending || !hasUnreadMessages}
                      className={`rounded-md ${colors.background.primary} px-4 py-2 ${colors.text.white} ${colors.interactive.hover.bg.blue} ${colors.background.disabled}`}
                    >
                      {markAllMessagesAsReadMutation.isPending ? "Marking as read..." : "Read All"}
                    </button>
                  </div>
                  <div className="space-y-4">
                    {messagesQuery.data?.receivedMessages.map((message) => (
                      <LetterItem
                        key={message.id}
                        message={message}
                        currentUsername={username}
                        onMessageRead={handleMessageRead}
                      />
                    ))}
                    {messagesQuery.data?.receivedMessages.length === 0 && (
                      <p className={colors.text.muted}>No received letters</p>
                    )}
                  </div>
                </Tab.Panel>
                <Tab.Panel className="space-y-4">
                  {messagesQuery.data?.sentMessages.map((message) => (
                    <LetterItem
                      key={message.id}
                      message={message}
                      currentUsername={username}
                    />
                  ))}
                  {messagesQuery.data?.sentMessages.length === 0 && (
                    <p className={colors.text.muted}>No sent letters</p>
                  )}
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          )}
        </div>
      </div>
    </div>
  );
}

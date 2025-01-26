"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import toast from "react-hot-toast";
import { NavigationBar } from "@/components/NavigationBar";
import { LetterItem } from "@/components/LetterItem";
import { Tab } from "@headlessui/react";
import { colors } from "@/styles/colors";
import { SendLetterDialog } from "@/components/SendLetterDialog";
import { useTranslation } from "@/utils/i18n";

export default function HomePage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [username, setUsername] = useState<string>();
  const [isAdmin, setIsAdmin] = useState<boolean>();
  const [authToken, setAuthToken] = useState<string>();
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUsername = localStorage.getItem("username");
    const storedIsAdmin = localStorage.getItem("isAdmin") === "true";

    if (!storedToken || !storedUsername) {
      router.push("/login");
      return;
    }

    setAuthToken(storedToken);
    setUsername(storedUsername);
    setIsAdmin(storedIsAdmin);
  }, [router]);

  const messagesQuery = api.getUserMessages.useQuery(
    { authToken: authToken ?? "" },
    { enabled: !!authToken },
  );

  const markMessageAsReadMutation = api.markMessageAsRead.useMutation({
    onSuccess: () => {
      void messagesQuery.refetch();
    },
  });

  const handleMessageRead = (messageId: number) => {
    if (authToken) {
      markMessageAsReadMutation.mutate({ messageId, authToken });
    }
  };

  const hasUnreadMessages = messagesQuery.data?.receivedMessages.some(
    (message) => !message.isRead && new Date(message.visibleAt) <= new Date(),
  );

  if (!authToken || !username) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <NavigationBar username={username} isAdmin={isAdmin} />
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className={`rounded-lg ${colors.background.card} p-10 ${colors.shadow.sm}`}>
          <div className="flex justify-between items-center mb-10">
            <h2 className={`${colors.text.primary} text-2xl font-bold`}>
              {t("letterPile")}
            </h2>
            <button
              onClick={() => setIsSendDialogOpen(true)}
              className={`rounded-md ${colors.background.secondary} px-8 py-3 ${colors.text.white} ${colors.interactive.hover.bg.orange} transition-all duration-200`}
            >
              {t("sendLetter")}
            </button>
          </div>
          {messagesQuery.isPending ? (
            <p className="py-8 text-center">{t("loadingLetters")}</p>
          ) : messagesQuery.error ? (
            <p className={`py-8 text-center ${colors.text.error}`}>
              {t("errorLoadingLetters")}
            </p>
          ) : (
            <Tab.Group defaultIndex={0}>
              <Tab.List className="mb-8 flex space-x-6 border-b">
                <Tab
                  className={({ selected }) =>
                    `relative px-8 py-4 focus:outline-none ${
                      selected
                        ? `border-b-2 ${colors.text.blue.primary} border-teal-500 font-semibold`
                        : `${colors.text.muted} ${colors.interactive.hover.text.blue}`
                    }`
                  }
                >
                  <div className="flex items-center gap-1.5">
                    <span>{t("letterInbox")}</span>
                    {hasUnreadMessages && (
                      <span
                        className={`inline-flex h-[10px] w-[10px] rounded-full ${colors.background.notification} ring-2 ring-red-300`}
                      />
                    )}
                  </div>
                </Tab>
                <Tab
                  className={({ selected }) =>
                    `px-8 py-4 focus:outline-none ${
                      selected
                        ? `border-b-2 ${colors.text.blue.primary} border-teal-500 font-semibold`
                        : `${colors.text.muted} ${colors.interactive.hover.text.blue}`
                    }`
                  }
                >
                  {t("letterOutbox")}
                </Tab>
              </Tab.List>
              <Tab.Panels>
                <Tab.Panel>
                  <div className="space-y-8">
                    {messagesQuery.data?.receivedMessages.map((message) => (
                      <LetterItem
                        key={message.id}
                        message={message}
                        currentUsername={username}
                        onMessageRead={handleMessageRead}
                      />
                    ))}
                    {messagesQuery.data?.receivedMessages.length === 0 && (
                      <p className={`py-12 text-center ${colors.text.muted}`}>
                        {t("noReceivedLetters")}
                      </p>
                    )}
                  </div>
                </Tab.Panel>
                <Tab.Panel>
                  <div className="space-y-8">
                    {messagesQuery.data?.sentMessages.map((message) => (
                      <LetterItem
                        key={message.id}
                        message={message}
                        currentUsername={username}
                        onMessageRead={handleMessageRead}
                      />
                    ))}
                    {messagesQuery.data?.sentMessages.length === 0 && (
                      <p className={`py-12 text-center ${colors.text.muted}`}>
                        {t("noSentLetters")}
                      </p>
                    )}
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          )}
        </div>
      </div>

      <SendLetterDialog
        isOpen={isSendDialogOpen}
        onClose={() => setIsSendDialogOpen(false)}
        authToken={authToken}
        onSuccess={() => void messagesQuery.refetch()}
      />
    </div>
  );
}

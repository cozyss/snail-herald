"use client";

import { useState } from "react";
import { LetterDialog } from "./LetterDialog";
import Image from "next/image";
import { colors } from "@/styles/colors";
import { useTranslation } from "@/utils/i18n";

type LetterItemProps = {
  message: {
    id: number;
    content: string;
    createdAt: Date;
    visibleAt: Date;
    isRead: boolean;
    sender: {
      username: string;
      isAdmin: boolean;
    };
    receiver: {
      username: string;
    };
  };
  currentUsername: string;
  onMessageRead?: (messageId: number) => void;
  onLetterDeleted?: () => void;
};

export function LetterItem({
  message,
  currentUsername,
  onMessageRead,
  onLetterDeleted,
}: LetterItemProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { t } = useTranslation();
  const isSender = message.sender.username === currentUsername;
  const isAnnouncement = message.sender.isAdmin && !isSender;
  const isUnread = !message.isRead && !isSender;

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
    if (
      !message.isRead &&
      new Date(message.visibleAt) <= new Date() &&
      onMessageRead
    ) {
      onMessageRead(message.id);
    }
  };

  const previewText = isUnread
    ? t("openLetter")
    : message.content.slice(0, 20) + (message.content.length > 20 ? "..." : "");

  return (
    <>
      <div className="mb-4 w-full">
        <div
          className={`relative w-full rounded-lg border ${colors.border.card.normal} ${colors.background.card} p-6 ${colors.shadow.sm} transition-all duration-200 ${colors.border.card.hover} ${colors.shadow.hover} min-h-[100px] cursor-pointer`}
          onClick={handleOpenDialog}
        >
          {isUnread && (
            <div className="absolute right-2 top-2 h-16 w-16 transition-transform duration-200 hover:scale-105">
              <Image
                src="/stamp.jpeg"
                alt="Stamp"
                width={64}
                height={64}
                className="object-contain opacity-80"
              />
            </div>
          )}
          <div className="flex items-center">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-medium ${colors.text.blue.primary}`}
                >
                  {isSender ? t("to") : t("from")}
                </span>
                <span className={`font-semibold ${colors.text.primary}`}>
                  {isSender
                    ? message.receiver.username
                    : message.sender.username}
                </span>
                {isAnnouncement && (
                  <span
                    className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${colors.background.badge.admin} ${colors.badge.admin}`}
                  >
                    {t("announcement")}
                  </span>
                )}
              </div>
              <div
                className={`mt-2 text-sm ${colors.text.muted} ${isUnread ? "italic" : ""}`}
              >
                {previewText}
              </div>
            </div>
          </div>
          <div
            className={`absolute bottom-6 right-6 text-sm font-medium ${colors.text.muted}`}
          >
            {new Date(message.createdAt).toLocaleString([], {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </div>
        </div>
      </div>

      <LetterDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        message={message}
        isSender={isSender}
        isAnnouncement={isAnnouncement}
        currentUsername={currentUsername}
        onLetterDeleted={onLetterDeleted}
      />
    </>
  );
}

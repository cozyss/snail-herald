"use client";

import { useState } from "react";
import { LetterDialog } from "./LetterDialog";
import Image from "next/image";
import { colors } from "@/styles/colors";

type MessageItemProps = {
  message: {
    id: number;
    content: string;
    createdAt: Date;
    visibleAt: Date;
    isRead: boolean;
    sender: {
      username: string;
    };
    receiver: {
      username: string;
    };
  };
  currentUsername: string;
  onMessageRead?: (messageId: number) => void;
};

export function MessageItem({
  message,
  currentUsername,
  onMessageRead,
}: MessageItemProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isSender = message.sender.username === currentUsername;

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
    if (
      !isSender &&
      !message.isRead &&
      new Date(message.visibleAt) <= new Date() &&
      onMessageRead
    ) {
      onMessageRead(message.id);
    }
  };

  return (
    <>
      <div className="mb-2 w-full">
        <div
          className={`relative min-h-[100px] w-full cursor-pointer rounded-lg border ${colors.border.card.normal} ${colors.background.card} p-6 ${colors.shadow.sm} transition-all duration-200 ${colors.border.card.hover} ${colors.shadow.hover}`}
          onClick={handleOpenDialog}
        >
          {!isSender && (
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
                <span className={`text-sm font-medium ${colors.text.muted}`}>
                  {isSender ? "To:" : "From:"}
                </span>
                <span className={`font-semibold ${colors.text.primary}`}>
                  {isSender
                    ? message.receiver.username
                    : message.sender.username}
                </span>
              </div>
            </div>
          </div>
          <div className={`absolute bottom-6 right-6 text-sm ${colors.text.muted}`}>
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
      />
    </>
  );
}

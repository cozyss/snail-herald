"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { colors } from "@/styles/colors";
import { useTranslation } from "@/utils/i18n";
import { api } from "@/trpc/react";
import toast from "react-hot-toast";

type LetterDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  message: {
    id: number;
    content: string;
    createdAt: Date;
    sender: {
      username: string;
      isAdmin: boolean;
    };
    receiver: {
      username: string;
    };
  };
  isSender: boolean;
  isAnnouncement?: boolean;
  isEditable?: boolean;
  onSave?: (content: string) => void;
  onLetterDeleted?: () => void;
  currentUsername: string;
};

export function LetterDialog({
  isOpen,
  onClose,
  message,
  isSender,
  isAnnouncement,
  isEditable,
  onSave,
  onLetterDeleted,
  currentUsername,
}: LetterDialogProps) {
  const { t } = useTranslation();
  const [editedContent, setEditedContent] = useState(message.content);
  const deleteMessageMutation = api.deleteMessage.useMutation({
    onSuccess: () => {
      toast.success(t("letterDeletedSuccess"));
      onClose();
      if (onLetterDeleted) {
        onLetterDeleted();
      }
    },
    onError: (error) => {
      toast.error(error.message || t("errorOccurred"));
    },
  });

  const handleSave = () => {
    if (onSave) {
      onSave(editedContent);
    }
  };

  const handleDelete = () => {
    if (window.confirm(t("confirmDeleteLetter"))) {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) return;

      deleteMessageMutation.mutate({
        authToken,
        messageId: message.id,
      });
    }
  };

  const canDelete = message.sender.username === currentUsername || message.receiver.username === currentUsername;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className={`fixed inset-0 ${colors.background.backdrop} backdrop-blur-sm`}
          />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`w-full max-w-2xl transform overflow-hidden rounded-2xl ${colors.background.card} p-8 text-left align-middle shadow-xl transition-all`}
              >
                <Dialog.Title
                  as="h3"
                  className={`text-xl font-semibold leading-6 ${colors.text.blue.primary} border-b border-blue-100 pb-4`}
                >
                  {isAnnouncement && (
                    <span
                      className={`mb-2 inline-block rounded-full px-2 py-0.5 text-sm font-medium ${colors.background.badge.admin} ${colors.badge.admin}`}
                    >
                      {t("announcement")}
                    </span>
                  )}
                  <div className="flex items-center gap-2">
                    <span className={`${colors.text.muted} font-medium`}>
                      {t("from")}:
                    </span>
                    <span className="font-semibold">
                      {message.sender.username}
                    </span>
                    <span className={`${colors.text.muted} font-medium`}>
                      {t("to")}:
                    </span>
                    <span className="font-semibold">
                      {message.receiver.username}
                    </span>
                  </div>
                </Dialog.Title>
                <div
                  className={`mt-8 min-h-[300px] ${colors.background.card} max-h-[60vh] overflow-y-auto rounded-lg p-6`}
                  style={{
                    backgroundImage:
                      "linear-gradient(#e5e7eb 1px, transparent 1px)",
                    backgroundSize: "100% 2rem",
                    backgroundPosition: "0 0.5rem",
                  }}
                >
                  {isEditable ? (
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className={`h-full min-h-[280px] w-full bg-transparent ${colors.text.secondary} text-lg leading-8`}
                      style={{
                        resize: "vertical",
                        border: "none",
                        outline: "none",
                        padding: "0.5rem 0",
                      }}
                    />
                  ) : (
                    <div
                      className={`${colors.text.secondary} whitespace-pre-wrap text-lg leading-8`}
                      style={{
                        padding: "0.5rem 0",
                      }}
                    >
                      {message.content}
                    </div>
                  )}
                </div>
                {!isEditable && (
                  <div
                    className={`mt-6 text-sm ${colors.text.muted} font-medium`}
                  >
                    {t("sentAt")}{" "}
                    {new Date(message.createdAt).toLocaleString([], {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </div>
                )}

                <div className="mt-8 flex justify-between">
                  <div>
                    {canDelete && !isAnnouncement && (
                      <button
                        type="button"
                        className={`inline-flex justify-center rounded-md border border-transparent bg-red-600 px-6 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-red-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2`}
                        onClick={handleDelete}
                        disabled={deleteMessageMutation.isPending}
                      >
                        {deleteMessageMutation.isPending ? t("deleting") : t("delete")}
                      </button>
                    )}
                  </div>
                  <div className="flex gap-4">
                    {isEditable && (
                      <button
                        type="button"
                        className={`inline-flex justify-center rounded-md border border-transparent ${colors.background.primary} px-6 py-2.5 text-sm font-medium ${colors.text.white} transition-all duration-200 ${colors.interactive.hover.bg.blue} hover:shadow-md focus:outline-none focus:ring-2 ${colors.ring.focus.blue} focus:ring-offset-2`}
                        onClick={handleSave}
                      >
                        {t("save")}
                      </button>
                    )}
                    <button
                      type="button"
                      className={`inline-flex justify-center rounded-md border border-transparent ${colors.background.primary} px-6 py-2.5 text-sm font-medium ${colors.text.white} transition-all duration-200 ${colors.interactive.hover.bg.blue} hover:shadow-md focus:outline-none focus:ring-2 ${colors.ring.focus.blue} focus:ring-offset-2`}
                      onClick={onClose}
                    >
                      {isEditable ? t("cancel") : t("closeLetter")}
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

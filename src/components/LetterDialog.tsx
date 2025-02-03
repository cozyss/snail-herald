"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { colors } from "@/styles/colors";
import { useTranslation } from "@/utils/i18n";

type LetterDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  message: {
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
};

export function LetterDialog({ 
  isOpen, 
  onClose, 
  message, 
  isSender, 
  isAnnouncement,
  isEditable,
  onSave 
}: LetterDialogProps) {
  const { t } = useTranslation();
  const [editedContent, setEditedContent] = useState(message.content);

  const handleSave = () => {
    if (onSave) {
      onSave(editedContent);
    }
  };

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
          <div className={`fixed inset-0 ${colors.background.backdrop} backdrop-blur-sm`} />
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
              <Dialog.Panel className={`w-full max-w-2xl transform overflow-hidden rounded-2xl ${colors.background.card} p-8 text-left align-middle shadow-xl transition-all`}>
                <Dialog.Title as="h3" className={`text-xl font-semibold leading-6 ${colors.text.blue.primary} border-b border-blue-100 pb-4`}>
                  {isAnnouncement && (
                    <span className={`inline-block mb-2 px-2 py-0.5 text-sm font-medium rounded-full ${colors.background.badge.admin} ${colors.badge.admin}`}>
                      {t("announcement")}
                    </span>
                  )}
                  <div className="flex items-center gap-2">
                    <span className={`${colors.text.muted} font-medium`}>{t("from")}:</span>
                    <span className="font-semibold">{message.sender.username}</span>
                    <span className={`${colors.text.muted} font-medium`}>{t("to")}:</span>
                    <span className="font-semibold">{message.receiver.username}</span>
                  </div>
                </Dialog.Title>
                <div 
                  className={`mt-8 min-h-[300px] ${colors.background.card} rounded-lg p-6 overflow-y-auto max-h-[60vh]`} 
                  style={{ 
                    backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px)',
                    backgroundSize: '100% 2rem',
                    backgroundPosition: '0 0.5rem',
                  }}
                >
                  {isEditable ? (
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className={`w-full h-full min-h-[280px] bg-transparent ${colors.text.secondary} text-lg leading-8`}
                      style={{
                        resize: 'vertical',
                        border: 'none',
                        outline: 'none',
                        padding: '0.5rem 0',
                      }}
                    />
                  ) : (
                    <div 
                      className={`${colors.text.secondary} whitespace-pre-wrap text-lg leading-8`}
                      style={{
                        padding: '0.5rem 0',
                      }}
                    >
                      {message.content}
                    </div>
                  )}
                </div>
                {!isEditable && (
                  <div className={`mt-6 text-sm ${colors.text.muted} font-medium`}>
                    {t("sentAt")} {new Date(message.createdAt).toLocaleString([], {
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </div>
                )}

                <div className="mt-8 flex justify-end gap-4">
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
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

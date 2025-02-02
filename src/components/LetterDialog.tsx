"use client";

import { Fragment } from "react";
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
};

export function LetterDialog({ isOpen, onClose, message, isSender, isAnnouncement }: LetterDialogProps) {
  const { t } = useTranslation();

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
                  className={`mt-8 min-h-[300px] ${colors.background.card} rounded-lg p-6`} 
                  style={{ 
                    backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px)',
                    backgroundSize: '100% 32px',
                    backgroundPosition: '0 32px',
                    paddingTop: '0'
                  }}
                >
                  <p 
                    className={`${colors.text.secondary} whitespace-pre-wrap text-lg`}
                    style={{
                      lineHeight: '32px',
                      margin: 0,
                      paddingBottom: '16px'
                    }}
                  >
                    {message.content}
                  </p>
                </div>
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

                <div className="mt-8">
                  <button
                    type="button"
                    className={`inline-flex justify-center rounded-md border border-transparent ${colors.background.primary} px-6 py-2.5 text-sm font-medium ${colors.text.white} transition-all duration-200 ${colors.interactive.hover.bg.blue} hover:shadow-md focus:outline-none focus:ring-2 ${colors.ring.focus.blue} focus:ring-offset-2`}
                    onClick={onClose}
                  >
                    {t("closeLetter")}
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

"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { colors } from "@/styles/colors";
import { api } from "@/trpc/react";
import toast from "react-hot-toast";

type SendAnnouncementDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  authToken: string;
  onSuccess?: () => void;
};

export function SendAnnouncementDialog({ isOpen, onClose, authToken, onSuccess }: SendAnnouncementDialogProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<{
    content: string;
  }>();

  const sendAnnouncementMutation = api.sendAnnouncement.useMutation({
    onSuccess: () => {
      toast.success("Announcement sent successfully!");
      reset();
      onSuccess?.();
      onClose();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = handleSubmit((data) => {
    sendAnnouncementMutation.mutate({
      authToken,
      content: data.content,
    });
  });

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
                  Send an Announcement
                </Dialog.Title>

                <form onSubmit={onSubmit} className="mt-6 space-y-6">
                  <div 
                    className="relative min-h-[300px] rounded-lg"
                    style={{ 
                      backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px)',
                      backgroundSize: '100% 32px',
                      backgroundPosition: '0 16px',
                      paddingTop: '16px'
                    }}
                  >
                    <textarea
                      {...register("content", {
                        required: "Announcement content is required",
                      })}
                      className={`w-full bg-transparent p-0 focus:outline-none ${colors.text.secondary} text-lg`}
                      style={{
                        lineHeight: '32px',
                        border: 'none',
                        resize: 'none',
                        height: '300px'
                      }}
                      placeholder="Type your announcement here..."
                    />
                  </div>
                  {errors.content && (
                    <p className={`text-sm ${colors.text.error}`}>
                      {errors.content.message}
                    </p>
                  )}

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className={`rounded-md px-4 py-2 text-sm font-medium ${colors.text.primary} ${colors.background.hover.card} border ${colors.border.card.normal}`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={sendAnnouncementMutation.isPending}
                      className={`rounded-md ${colors.background.primary} px-6 py-2 text-sm font-medium ${colors.text.white} ${colors.interactive.hover.bg.blue} transition-all duration-200 disabled:${colors.background.disabled}`}
                    >
                      {sendAnnouncementMutation.isPending ? "Sending..." : "Send Announcement"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

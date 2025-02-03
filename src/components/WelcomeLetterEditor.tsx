"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { colors } from "@/styles/colors";
import { useTranslation } from "@/utils/i18n";
import { LetterDialog } from "./LetterDialog";
import toast from "react-hot-toast";

type WelcomeLetterEditorProps = {
  authToken: string;
};

export function WelcomeLetterEditor({ authToken }: WelcomeLetterEditorProps) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);

  const welcomeTemplateQuery = api.getWelcomeTemplate.useQuery(
    { authToken },
    {
      enabled: !!authToken,
    }
  );

  const updateWelcomeTemplateMutation = api.updateWelcomeTemplate.useMutation({
    onSuccess: () => {
      toast.success(t("welcomeTemplateUpdated"));
      setIsEditing(false);
      welcomeTemplateQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const previewMessage = {
    content: welcomeTemplateQuery.data?.content ?? "",
    createdAt: welcomeTemplateQuery.data?.updatedAt ?? new Date(),
    sender: {
      username: "Admin",
      isAdmin: true,
    },
    receiver: {
      username: "New User",
    },
  };

  const characterCount = welcomeTemplateQuery.data?.content.length ?? 0;

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className={`text-sm ${colors.text.muted}`}>
            {t("lastModified")}: {" "}
            {welcomeTemplateQuery.data?.updatedAt 
              ? new Date(welcomeTemplateQuery.data.updatedAt).toLocaleString()
              : "-"}
          </p>
          <p className={`text-sm ${colors.text.muted}`}>
            {characterCount} {t("characters")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`rounded-md ${isEditing ? colors.background.secondary : colors.background.primary} px-4 py-2 text-sm font-medium ${colors.text.white} transition-all duration-200 hover:opacity-90`}
          >
            {isEditing ? t("cancel") : t("edit")}
          </button>
          {isEditing && (
            <button
              onClick={() => {
                if (welcomeTemplateQuery.data?.content) {
                  updateWelcomeTemplateMutation.mutate({
                    authToken,
                    content: welcomeTemplateQuery.data.content,
                  });
                }
              }}
              disabled={updateWelcomeTemplateMutation.isPending}
              className={`rounded-md ${colors.background.primary} px-4 py-2 text-sm font-medium ${colors.text.white} ${colors.interactive.hover.bg.blue} transition-all duration-200 disabled:${colors.background.disabled}`}
            >
              {updateWelcomeTemplateMutation.isPending ? t("saving") : t("save")}
            </button>
          )}
        </div>
      </div>

      <div 
        className={`relative rounded-lg ${colors.background.page} p-4 transition-all duration-200 ${isEditing ? 'ring-2 ring-emerald-500' : ''}`}
      >
        <p className={`whitespace-pre-wrap ${colors.text.secondary}`}>
          {welcomeTemplateQuery.data?.content || t("loading")}
        </p>
      </div>

      {isEditing && (
        <LetterDialog
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          message={previewMessage}
          isSender={true}
          isEditable={true}
          onSave={(content) => {
            updateWelcomeTemplateMutation.mutate({
              authToken,
              content,
            });
          }}
        />
      )}
    </div>
  );
}

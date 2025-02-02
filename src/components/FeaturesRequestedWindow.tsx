"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import toast from "react-hot-toast";
import { colors } from "@/styles/colors";
import { useTranslation } from "@/utils/i18n";

type FeaturesRequestedWindowProps = {
  authToken: string;
  isAdmin?: boolean;
};

export function FeaturesRequestedWindow({ authToken, isAdmin }: FeaturesRequestedWindowProps) {
  const { t } = useTranslation();
  const [isCreating, setIsCreating] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<{
    description: string;
  }>();

  const featuresQuery = api.getFeatureRequests.useQuery(
    { authToken },
    { refetchInterval: 5000 }
  );

  const createFeatureMutation = api.createFeatureRequest.useMutation({
    onSuccess: () => {
      toast.success(t("featureRequestCreated"));
      setIsCreating(false);
      reset();
      void featuresQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const voteMutation = api.voteOnFeature.useMutation({
    onSuccess: () => {
      void featuresQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteFeatureMutation = api.deleteFeatureRequest.useMutation({
    onSuccess: () => {
      toast.success(t("featureRequestDeleted"));
      void featuresQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = handleSubmit((data) => {
    createFeatureMutation.mutate({
      authToken,
      description: data.description,
    });
  });

  const handleVote = (featureRequestId: number, voteType: "UPVOTE" | "DOWNVOTE") => {
    voteMutation.mutate({
      authToken,
      featureRequestId,
      voteType,
    });
  };

  const handleDelete = (featureRequestId: number) => {
    if (window.confirm("Are you sure you want to delete this feature request?")) {
      deleteFeatureMutation.mutate({
        authToken,
        featureRequestId,
      });
    }
  };

  return (
    <div className={`fixed left-4 top-24 w-80 rounded-lg ${colors.background.card} p-4 ${colors.shadow.md} max-h-[calc(100vh-120px)] flex flex-col`}>
      <h2 className={`mb-4 text-lg font-semibold ${colors.text.blue.primary}`}>
        {t("featuresRequested")}
      </h2>

      {isCreating ? (
        <form onSubmit={onSubmit} className="mb-4">
          <textarea
            {...register("description", { required: t("featureDescriptionRequired") })}
            className={`w-full rounded-md border ${colors.border.input.normal} p-2 text-sm ${colors.text.secondary}`}
            rows={3}
            placeholder={t("typeFeatureDescription")}
          />
          {errors.description && (
            <p className={`mt-1 text-sm ${colors.text.error}`}>
              {errors.description.message}
            </p>
          )}
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className={`rounded px-3 py-1 text-sm ${colors.text.primary} ${colors.background.hover.card}`}
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              disabled={createFeatureMutation.isPending}
              className={`rounded ${colors.background.primary} px-3 py-1 text-sm ${colors.text.white} ${colors.interactive.hover.bg.blue}`}
            >
              {createFeatureMutation.isPending ? t("creating") : t("create")}
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsCreating(true)}
          className={`mb-4 w-full rounded ${colors.background.primary} px-4 py-2 text-sm ${colors.text.white} ${colors.interactive.hover.bg.blue}`}
        >
          {t("newFeatureRequest")}
        </button>
      )}

      <div className="space-y-4 overflow-y-auto flex-1">
        {featuresQuery.data?.map((feature) => (
          <div
            key={feature.id}
            className={`rounded-lg border ${colors.border.card.normal} p-3`}
          >
            <p className={`mb-2 text-sm ${colors.text.secondary}`}>
              {feature.description}
            </p>
            <div className="flex items-center justify-between text-xs">
              <span className={colors.text.muted}>
                {t("by")} {feature.createdBy}
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleVote(feature.id, "UPVOTE")}
                  disabled={voteMutation.isPending}
                  className={`flex items-center gap-1 ${colors.text.blue.primary} ${colors.interactive.hover.text.blue}`}
                >
                  👍 {feature.upvotes}
                </button>
                <button
                  onClick={() => handleVote(feature.id, "DOWNVOTE")}
                  disabled={voteMutation.isPending}
                  className={`flex items-center gap-1 ${colors.text.error} hover:text-red-700`}
                >
                  👎 {feature.downvotes}
                </button>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(feature.id)}
                    disabled={deleteFeatureMutation.isPending}
                    className={`flex items-center gap-1 ${colors.text.error} hover:text-red-700 ml-2`}
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

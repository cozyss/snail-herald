"use client";

import { useState } from "react";
import { type RouterOutputs } from "@/trpc/react";
import { useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import toast from "react-hot-toast";
import { colors } from "@/styles/colors";
import { useTranslation } from "@/utils/i18n";
import { VotePanel } from "./VotePanel";

type FeaturesRequestedWindowProps = {
  authToken: string;
  isAdmin?: boolean;
};

function ActionPoints({ authToken }: { authToken: string }) {
  const { t } = useTranslation();
  const pointsQuery = api.getRemainingActionPoints.useQuery({ authToken });

  if (pointsQuery.isPending || !pointsQuery.data) {
    return null;
  }

  return (
    <div className="flex justify-center">
      <div className={`px-4 py-1.5 rounded-full ${colors.background.badge.admin} ${colors.badge.admin} text-sm font-medium`}>
        {t("actionPointsLeft", { points: pointsQuery.data.points.toString() })}
      </div>
    </div>
  );
}

export function FeaturesRequestedWindow({ authToken, isAdmin }: FeaturesRequestedWindowProps) {
  const { t } = useTranslation();
  const [isCreating, setIsCreating] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
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
    <div className={`fixed left-0 top-24 flex transition-transform duration-300 ease-in-out ${isCollapsed ? 'translate-x-[-280px]' : 'translate-x-4'}`}>
      <div className={`w-80 rounded-lg ${colors.background.card} p-4 ${colors.shadow.md} max-h-[calc(100vh-120px)] flex flex-col`}>
        <div className="flex flex-col gap-3 mb-4">
          <h2 className={`text-lg font-semibold ${colors.text.blue.primary} text-center`}>
            {t("featuresRequested")}
          </h2>
          
          <ActionPoints authToken={authToken} />

          {!isCreating && (
            <button
              onClick={() => setIsCreating(true)}
              className={`w-full rounded-lg ${colors.background.primary} px-4 py-2 text-sm font-medium ${colors.text.white} ${colors.interactive.hover.bg.blue} transition-colors duration-200`}
            >
              {t("newFeatureRequest")}
            </button>
          )}
        </div>

        {isCreating && (
          <form onSubmit={onSubmit} className="mb-4">
            <textarea
              {...register("description", { required: t("featureDescriptionRequired") })}
              className={`w-full rounded-lg border ${colors.border.input.normal} p-3 text-sm ${colors.text.secondary} focus:outline-none ${colors.ring.focus.blue} focus:border-transparent`}
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
                className={`rounded-lg px-4 py-2 text-sm font-medium ${colors.text.primary} ${colors.background.hover.card} transition-colors duration-200`}
              >
                {t("cancel")}
              </button>
              <button
                type="submit"
                disabled={createFeatureMutation.isPending}
                className={`rounded-lg ${colors.background.primary} px-4 py-2 text-sm font-medium ${colors.text.white} ${colors.interactive.hover.bg.blue} transition-colors duration-200`}
              >
                {createFeatureMutation.isPending ? t("creating") : t("create")}
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3 overflow-y-auto flex-1">
          {featuresQuery.data?.map((feature) => (
            <div
              key={feature.id}
              className={`rounded-lg border ${colors.border.card.normal} p-4 transition-all duration-200 hover:border-emerald-400 hover:shadow-md`}
            >
              <p className={`mb-3 text-sm ${colors.text.secondary}`}>
                {feature.description}
              </p>
              <div className="flex items-center justify-between text-xs">
                <span className={`${colors.text.muted} font-medium`}>
                  {t("by")} {feature.createdBy}
                </span>
                <VotePanel
                  featureId={feature.id}
                  upvotes={feature.upvotes}
                  downvotes={feature.downvotes}
                  score={feature.score}
                  onUpvote={(id) => handleVote(id, "UPVOTE")}
                  onDownvote={(id) => handleVote(id, "DOWNVOTE")}
                  disabled={voteMutation.isPending || deleteFeatureMutation.isPending}
                  isAdmin={isAdmin}
                  onDelete={handleDelete}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`h-12 w-8 self-start mt-4 ml-2 rounded-r-lg ${colors.background.primary} ${colors.text.white} flex items-center justify-center transition-colors duration-200 ${colors.interactive.hover.bg.blue}`}
        aria-label={isCollapsed ? "Expand features panel" : "Collapse features panel"}
      >
        {isCollapsed ? ">" : "<"}
      </button>
    </div>
  );
}

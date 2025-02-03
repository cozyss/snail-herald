"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { NavigationBar } from "@/components/NavigationBar";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { colors } from "@/styles/colors";
import { SendAnnouncementDialog } from "@/components/SendAnnouncementDialog";
import { FeaturesRequestedWindow } from "@/components/FeaturesRequestedWindow";
import { useTranslation } from "@/utils/i18n";
import { WelcomeLetterEditor } from "@/components/WelcomeLetterEditor";

type DelaySettingsFormData = {
  minDelay: number;
  maxDelay: number;
};

export default function AdminDashboard() {
  const router = useRouter();
  const { t } = useTranslation();
  const [username, setUsername] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [authToken, setAuthToken] = useState<string>("");
  const [isEditingDelays, setIsEditingDelays] = useState(false);
  const [isAnnouncementDialogOpen, setIsAnnouncementDialogOpen] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedIsAdmin = localStorage.getItem("isAdmin") === "true";
    const storedAuthToken = localStorage.getItem("authToken");

    if (!storedUsername || !storedAuthToken || !storedIsAdmin) {
      router.push("/login");
      return;
    }

    setUsername(storedUsername);
    setIsAdmin(storedIsAdmin);
    setAuthToken(storedAuthToken);
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DelaySettingsFormData>();

  const delaySettingsQuery = api.getDelaySettings.useQuery(
    { authToken },
    {
      enabled: !!authToken,
    }
  );

  const userStatsQuery = api.getAllUserStats.useQuery(
    { authToken },
    {
      enabled: !!authToken,
    }
  );

  const updateDelaySettingsMutation = api.updateDelaySettings.useMutation({
    onSuccess: () => {
      toast.success(t("settingsUpdatedSuccess"));
      setIsEditingDelays(false);
      delaySettingsQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = handleSubmit((data) => {
    if (data.minDelay > data.maxDelay) {
      toast.error(t("errorOccurred"));
      return;
    }
    updateDelaySettingsMutation.mutate({
      authToken,
      minDelay: data.minDelay,
      maxDelay: data.maxDelay,
    });
  });

  if (!username || !authToken || !isAdmin) {
    return null;
  }

  const cardClasses = `min-h-[400px] rounded-lg ${colors.background.card} p-8 ${colors.shadow.sm} transition-shadow hover:shadow-md`;
  const headerClasses = `flex items-center gap-3 border-b border-gray-200 pb-4 mb-6`;
  const headerIconClasses = "text-2xl";
  const headerTextClasses = `text-2xl font-bold ${colors.text.primary}`;

  return (
    <div className="min-h-screen bg-amber-50">
      <NavigationBar username={username} isAdmin={isAdmin} />
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left Column - Message Management */}
          <div className="space-y-8">
            {/* Welcome Letter Section */}
            <div className={cardClasses}>
              <div className={headerClasses}>
                <span className={headerIconClasses}>✉️</span>
                <h2 className={headerTextClasses}>
                  {t("welcomeLetter")}
                </h2>
              </div>
              <WelcomeLetterEditor authToken={authToken} />
            </div>

            {/* Message Delay Settings Section */}
            <div className={cardClasses}>
              <div className={headerClasses}>
                <span className={headerIconClasses}>⏱️</span>
                <h2 className={headerTextClasses}>
                  {t("messageDelaySettings")}
                </h2>
              </div>

              <div className={`mt-6 flex items-center justify-between rounded-lg ${colors.background.page} p-4`}>
                <div className="flex items-center gap-4">
                  <span className={`text-sm font-medium ${colors.text.secondary}`}>
                    {t("currentDelayRange")}
                  </span>
                  {delaySettingsQuery.isPending ? (
                    <div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
                  ) : delaySettingsQuery.data ? (
                    <span className={`text-lg font-semibold ${colors.text.primary}`}>
                      {delaySettingsQuery.data.minDelay} - {delaySettingsQuery.data.maxDelay} {t("hours")}
                    </span>
                  ) : (
                    <span className={`text-sm ${colors.text.error}`}>{t("errorLoadingSettings")}</span>
                  )}
                </div>
                <button
                  onClick={() => setIsEditingDelays(!isEditingDelays)}
                  className={`rounded-md ${colors.background.primary} px-3 py-1.5 text-sm font-medium ${colors.text.white} ${colors.interactive.hover.bg.blue} transition-all duration-200`}
                >
                  {isEditingDelays ? t("cancel") : t("update")}
                </button>
              </div>

              {isEditingDelays && (
                <div className={`mt-6 rounded-lg ${colors.background.page} p-4`}>
                  <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="minDelay"
                          className={`mb-1 block text-sm font-medium ${colors.text.secondary}`}
                        >
                          {t("minDelay")}
                        </label>
                        <input
                          type="range"
                          id="minDelay"
                          min="0"
                          max="72"
                          {...register("minDelay", {
                            required: "Required",
                            min: { value: 0, message: "Must be 0 or greater" },
                            valueAsNumber: true,
                          })}
                          className="w-full"
                        />
                        <input
                          type="number"
                          {...register("minDelay", {
                            required: "Required",
                            min: { value: 0, message: "Must be 0 or greater" },
                            valueAsNumber: true,
                          })}
                          className={`mt-2 w-full rounded-md border ${colors.border.input.normal} px-3 py-2 focus:outline-none`}
                        />
                        {errors.minDelay && (
                          <p className={`mt-1 text-sm ${colors.text.error}`}>
                            {errors.minDelay.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="maxDelay"
                          className={`mb-1 block text-sm font-medium ${colors.text.secondary}`}
                        >
                          {t("maxDelay")}
                        </label>
                        <input
                          type="range"
                          id="maxDelay"
                          min="0"
                          max="72"
                          {...register("maxDelay", {
                            required: "Required",
                            min: { value: 0, message: "Must be 0 or greater" },
                            valueAsNumber: true,
                          })}
                          className="w-full"
                        />
                        <input
                          type="number"
                          {...register("maxDelay", {
                            required: "Required",
                            min: { value: 0, message: "Must be 0 or greater" },
                            valueAsNumber: true,
                          })}
                          className={`mt-2 w-full rounded-md border ${colors.border.input.normal} px-3 py-2 focus:outline-none`}
                        />
                        {errors.maxDelay && (
                          <p className={`mt-1 text-sm ${colors.text.error}`}>
                            {errors.maxDelay.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={updateDelaySettingsMutation.isPending}
                      className={`w-full rounded-md ${colors.background.primary} px-4 py-2 font-medium ${colors.text.white} ${colors.interactive.hover.bg.blue} transition-all duration-200 disabled:${colors.background.disabled}`}
                    >
                      {updateDelaySettingsMutation.isPending ? t("updating") : t("saveChanges")}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - User Management & Communication */}
          <div className="space-y-8">
            {/* User Management Section */}
            <div className={cardClasses}>
              <div className={headerClasses}>
                <span className={headerIconClasses}>👥</span>
                <h2 className={headerTextClasses}>
                  {t("userManagement")}
                </h2>
              </div>

              {userStatsQuery.isPending ? (
                <div className="mt-6 space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-12 w-full animate-pulse rounded bg-gray-200" />
                  ))}
                </div>
              ) : userStatsQuery.error ? (
                <p className={`mt-6 ${colors.text.error}`}>{t("errorOccurred")}</p>
              ) : (
                <div className="mt-6">
                  <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                    <div className={`rounded-lg ${colors.background.page} p-4 text-center`}>
                      <p className={`text-sm ${colors.text.muted}`}>{t("totalUsers")}</p>
                      <p className={`text-2xl font-bold ${colors.text.primary}`}>
                        {userStatsQuery.data.length}
                      </p>
                    </div>
                    <div className={`rounded-lg ${colors.background.page} p-4 text-center`}>
                      <p className={`text-sm ${colors.text.muted}`}>{t("totalAdmins")}</p>
                      <p className={`text-2xl font-bold ${colors.text.primary}`}>
                        {userStatsQuery.data.filter(user => user.isAdmin).length}
                      </p>
                    </div>
                    <div className={`rounded-lg ${colors.background.page} p-4 text-center sm:col-span-1`}>
                      <p className={`text-sm ${colors.text.muted}`}>{t("totalLetters")}</p>
                      <p className={`text-2xl font-bold ${colors.text.primary}`}>
                        {userStatsQuery.data.reduce((acc, user) => acc + user.messageCount, 0)}
                      </p>
                    </div>
                  </div>
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className={`min-w-full divide-y ${colors.border.divider}`}>
                      <thead className={colors.background.page}>
                        <tr>
                          <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${colors.text.muted}`}>
                            {t("username")}
                          </th>
                          <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${colors.text.muted}`}>
                            {t("lettersSent")}
                          </th>
                          <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${colors.text.muted}`}>
                            {t("createdAt")}
                          </th>
                          <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${colors.text.muted}`}>
                            {t("role")}
                          </th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${colors.border.divider} ${colors.background.card}`}>
                        {userStatsQuery.data.map((user) => (
                          <tr key={user.id} className="transition-colors hover:bg-gray-50">
                            <td className="whitespace-nowrap px-6 py-4">
                              {user.username}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              {user.messageCount}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              {new Date(user.createdAt).toLocaleString()}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              {user.isAdmin ? (
                                <span className={`rounded-full ${colors.background.badge.admin} px-2 py-1 text-xs font-semibold ${colors.badge.admin}`}>
                                  {t("admin")}
                                </span>
                              ) : (
                                <span className={`rounded-full ${colors.background.badge.user} px-2 py-1 text-xs font-semibold ${colors.badge.user}`}>
                                  {t("user")}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Communication Section */}
            <div className={cardClasses}>
              <div className={headerClasses}>
                <div className="flex items-center gap-3">
                  <span className={headerIconClasses}>📢</span>
                  <h2 className={headerTextClasses}>
                    {t("communication")}
                  </h2>
                </div>
                <button
                  onClick={() => setIsAnnouncementDialogOpen(true)}
                  className={`ml-auto rounded-md ${colors.background.primary} px-4 py-2 text-sm font-medium ${colors.text.white} ${colors.interactive.hover.bg.blue} transition-all duration-200`}
                >
                  {t("sendAnnouncement")}
                </button>
              </div>
              <div className="mt-6">
                <FeaturesRequestedWindow authToken={authToken} isAdmin={true} />
              </div>
            </div>
          </div>
        </div>

        <SendAnnouncementDialog
          isOpen={isAnnouncementDialogOpen}
          onClose={() => setIsAnnouncementDialogOpen(false)}
          authToken={authToken}
          onSuccess={() => {
            // Optionally refresh any data if needed
          }}
        />
      </div>
    </div>
  );
}

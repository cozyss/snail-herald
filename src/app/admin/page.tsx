"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { NavigationBar } from "@/components/NavigationBar";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { colors } from "@/styles/colors";
import { SendAnnouncementDialog } from "@/components/SendAnnouncementDialog";

type DelaySettingsFormData = {
  minDelay: number;
  maxDelay: number;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [authToken, setAuthToken] = useState<string>("");
  const [isEditingDelays, setIsEditingDelays] = useState(false);
  const [isAnnouncementDialogOpen, setIsAnnouncementDialogOpen] = useState(false);

  // Initialize user data from localStorage
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
      toast.success("Delay settings updated successfully!");
      setIsEditingDelays(false);
      delaySettingsQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = handleSubmit((data) => {
    if (data.minDelay > data.maxDelay) {
      toast.error("Minimum delay cannot be greater than maximum delay");
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

  return (
    <div>
      <NavigationBar username={username} isAdmin={isAdmin} />
      <div className="container mx-auto max-w-6xl p-4">
        {/* Send Announcement Button */}
        <div className={`mb-4 flex justify-end`}>
          <button
            onClick={() => setIsAnnouncementDialogOpen(true)}
            className={`rounded-md ${colors.background.primary} px-4 py-2 text-sm font-medium ${colors.text.white} ${colors.interactive.hover.bg.blue} transition-all duration-200`}
          >
            Send an Announcement
          </button>
        </div>

        <SendAnnouncementDialog
          isOpen={isAnnouncementDialogOpen}
          onClose={() => setIsAnnouncementDialogOpen(false)}
          authToken={authToken}
          onSuccess={() => {
            // Optionally refresh any data if needed
          }}
        />
        {/* Current Delay Settings Display */}
        <div className={`mb-4 flex items-center justify-between rounded-lg ${colors.background.card} p-4 ${colors.shadow.sm}`}>
          <div className="flex items-center gap-4">
            <span className={`text-sm font-medium ${colors.text.secondary}`}>Current Delay Range:</span>
            {delaySettingsQuery.isPending ? (
              <span className={`text-sm ${colors.text.muted}`}>Loading...</span>
            ) : delaySettingsQuery.data ? (
              <span className={`text-sm font-semibold ${colors.text.primary}`}>
                {delaySettingsQuery.data.minDelay} - {delaySettingsQuery.data.maxDelay} hours
              </span>
            ) : (
              <span className={`text-sm ${colors.text.error}`}>Error loading settings</span>
            )}
          </div>
          <button
            onClick={() => setIsEditingDelays(!isEditingDelays)}
            className={`rounded-md ${colors.background.primary} px-3 py-1 text-sm ${colors.text.white} ${colors.interactive.hover.bg.blue} ${colors.background.disabled}`}
          >
            {isEditingDelays ? "Cancel" : "Update"}
          </button>
        </div>

        {/* Delay Settings Form */}
        {isEditingDelays && (
          <div className={`mb-8 rounded-lg ${colors.background.card} p-6 ${colors.shadow.sm}`}>
            <h2 className={`mb-4 text-2xl font-bold ${colors.text.primary}`}>Letter Delay Settings</h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="minDelay"
                    className={`mb-1 block text-sm font-medium ${colors.text.secondary}`}
                  >
                    Minimum Delay (hours)
                  </label>
                  <input
                    type="number"
                    id="minDelay"
                    {...register("minDelay", {
                      required: "Required",
                      min: { value: 0, message: "Must be 0 or greater" },
                    })}
                    className={`w-full rounded-md border ${colors.border.input.normal} px-3 py-2 focus:outline-none`}
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
                    Maximum Delay (hours)
                  </label>
                  <input
                    type="number"
                    id="maxDelay"
                    {...register("maxDelay", {
                      required: "Required",
                      min: { value: 0, message: "Must be 0 or greater" },
                    })}
                    className={`w-full rounded-md border ${colors.border.input.normal} px-3 py-2 focus:outline-none`}
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
                className={`rounded-md ${colors.background.primary} px-4 py-2 ${colors.text.white} ${colors.interactive.hover.bg.blue} ${colors.background.disabled}`}
              >
                {updateDelaySettingsMutation.isPending ? "Updating..." : "Save Changes"}
              </button>
            </form>
          </div>
        )}

        {/* User Statistics Table */}
        <div className={`rounded-lg ${colors.background.card} p-6 ${colors.shadow.sm}`}>
          <h2 className={`mb-4 text-2xl font-bold ${colors.text.primary}`}>User Statistics</h2>
          {userStatsQuery.isPending ? (
            <p>Loading user stats...</p>
          ) : userStatsQuery.error ? (
            <p className={colors.text.error}>Error loading user stats</p>
          ) : (
            <div className="overflow-x-auto">
              <table className={`min-w-full divide-y ${colors.border.divider}`}>
                <thead className={colors.background.page}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${colors.text.muted}`}>
                      Username
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${colors.text.muted}`}>
                      Letters Sent
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${colors.text.muted}`}>
                      Created At
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${colors.text.muted}`}>
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${colors.border.divider} ${colors.background.card}`}>
                  {userStatsQuery.data?.map((user) => (
                    <tr key={user.id}>
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
                            Admin
                          </span>
                        ) : (
                          <span className={`rounded-full ${colors.background.badge.user} px-2 py-1 text-xs font-semibold ${colors.badge.user}`}>
                            User
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

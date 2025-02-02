"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import toast from "react-hot-toast";
import { NavigationBar } from "@/components/NavigationBar";
import { colors } from "@/styles/colors";
import { useTranslation } from "@/utils/i18n";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  secretAnswer: z.string().min(1, "Security answer is required"),
});

type FormData = z.infer<typeof formSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useTranslation();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const loginMutation = api.loginUser.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("username", data.user.username);
      localStorage.setItem("isAdmin", data.user.isAdmin.toString());
      toast.success(t("registerSuccess"));
      router.push("/home");
    },
  });

  const registerMutation = api.registerUser.useMutation({
    onSuccess: () => {
      // After successful registration, automatically log in
      const { username, password } = getValues();
      loginMutation.mutate({ username, password });
    },
    onError: (error) => {
      if (error.message.includes("taken")) {
        toast.error(t("usernameTaken"));
      } else if (error.message.includes("security question")) {
        toast.error(t("incorrectSecurityAnswer"));
      } else {
        toast.error(t("errorOccurred"));
      }
    },
  });

  const onSubmit = handleSubmit((data) => {
    registerMutation.mutate(data);
  });

  return (
    <div>
      <NavigationBar />
      <div className={`flex min-h-screen items-center justify-center ${colors.background.page} px-4 py-12 sm:px-6 lg:px-8`}>
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className={`text-5xl font-bold ${colors.text.primary}`}>
              Herald
            </h1>
            <h2 className={`mt-6 text-center text-3xl font-bold tracking-tight ${colors.text.primary}`}>
              {t("slogan")}
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={onSubmit}>
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <label htmlFor="username" className="sr-only">
                  {t("username")}
                </label>
                <input
                  id="username"
                  type="text"
                  {...register("username")}
                  className={`relative block w-full rounded-md border-0 p-2 ${colors.text.primary} ring-1 ring-inset ${colors.border.input.normal} ${colors.input.placeholder} focus:ring-2 focus:ring-inset ${colors.border.input.focus} sm:text-sm`}
                  placeholder={t("username")}
                />
                {errors.username && (
                  <p className={`mt-1 text-sm ${colors.text.error}`}>
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  {t("password")}
                </label>
                <input
                  id="password"
                  type="password"
                  {...register("password")}
                  className={`relative block w-full rounded-md border-0 p-2 ${colors.text.primary} ring-1 ring-inset ${colors.border.input.normal} ${colors.input.placeholder} focus:ring-2 focus:ring-inset ${colors.border.input.focus} sm:text-sm`}
                  placeholder={t("password")}
                />
                {errors.password && (
                  <p className={`mt-1 text-sm ${colors.text.error}`}>
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="secretAnswer" className={`block text-sm font-medium ${colors.text.primary}`}>
                  What&apos;s the last name of Riley?
                </label>
                <input
                  id="secretAnswer"
                  type="text"
                  {...register("secretAnswer")}
                  className={`relative block w-full rounded-md border-0 p-2 ${colors.text.primary} ring-1 ring-inset ${colors.border.input.normal} ${colors.input.placeholder} focus:ring-2 focus:ring-inset ${colors.border.input.focus} sm:text-sm`}
                  placeholder="Enter your answer"
                />
                {errors.secretAnswer && (
                  <p className={`mt-1 text-sm ${colors.text.error}`}>
                    {errors.secretAnswer.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={registerMutation.isPending || loginMutation.isPending}
                className={`group relative flex w-full justify-center rounded-md ${colors.background.primary} px-3 py-2 text-sm font-semibold ${colors.text.white} ${colors.interactive.hover.bg.blue} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${colors.ring.focus.blue} ${colors.background.disabled}`}
              >
                {registerMutation.isPending || loginMutation.isPending ? t("registering") : t("register")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import toast from "react-hot-toast";
import { NavigationBar } from "@/components/NavigationBar";
import { colors } from "@/styles/colors";

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    username: string;
    password: string;
  }>();

  const loginMutation = api.loginUser.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("username", data.user.username);
      localStorage.setItem("isAdmin", data.user.isAdmin.toString());
      toast.success("Login successful!");
      router.push("/home");
    },
    onError: (error) => {
      if (error.data?.code === "NOT_FOUND") {
        toast.error("Username not found");
      } else if (error.data?.code === "UNAUTHORIZED") {
        toast.error("Incorrect password");
      } else {
        toast.error("An error occurred during login");
      }
    },
  });

  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(data);
  });

  return (
    <div>
      <NavigationBar username={undefined} isAdmin={undefined} />
      <div className={`flex min-h-screen items-center justify-center ${colors.background.page} px-4 py-12 sm:px-6 lg:px-8`}>
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className={`mt-6 text-center text-3xl font-bold tracking-tight ${colors.text.primary}`}>
              Sign in to your account
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={onSubmit}>
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  {...register("username", { required: "Username is required" })}
                  className={`relative block w-full rounded-md border-0 p-2 ${colors.text.primary} ring-1 ring-inset ${colors.border.input.normal} ${colors.input.placeholder} focus:ring-2 focus:ring-inset ${colors.border.input.focus} sm:text-sm`}
                  placeholder="Username"
                />
                {errors.username && (
                  <p className={`mt-1 text-sm ${colors.text.error}`}>
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  {...register("password", { required: "Password is required" })}
                  className={`relative block w-full rounded-md border-0 p-2 ${colors.text.primary} ring-1 ring-inset ${colors.border.input.normal} ${colors.input.placeholder} focus:ring-2 focus:ring-inset ${colors.border.input.focus} sm:text-sm`}
                  placeholder="Password"
                />
                {errors.password && (
                  <p className={`mt-1 text-sm ${colors.text.error}`}>
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loginMutation.isPending}
                className={`group relative flex w-full justify-center rounded-md ${colors.background.primary} px-3 py-2 text-sm font-semibold ${colors.text.white} ${colors.interactive.hover.bg.blue} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${colors.ring.focus.blue} ${colors.background.disabled}`}
              >
                {loginMutation.isPending ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

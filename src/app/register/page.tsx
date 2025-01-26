"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import toast from "react-hot-toast";
import { NavigationBar } from "@/components/NavigationBar";
import { colors } from "@/styles/colors";

export default function RegisterPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    username: string;
    password: string;
  }>();

  const registerMutation = api.registerUser.useMutation({
    onSuccess: () => {
      toast.success("Registration successful! Please log in.");
      router.push("/login");
    },
    onError: (error) => {
      toast.error(error.message);
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
          <div>
            <h2 className={`mt-6 text-center text-3xl font-bold tracking-tight ${colors.text.primary}`}>
              Create your account
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
                  {...register("username", {
                    required: "Username is required",
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters",
                    },
                  })}
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
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
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
                disabled={registerMutation.isPending}
                className={`group relative flex w-full justify-center rounded-md ${colors.background.primary} px-3 py-2 text-sm font-semibold ${colors.text.white} ${colors.interactive.hover.bg.blue} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${colors.ring.focus.blue} ${colors.background.disabled}`}
              >
                {registerMutation.isPending ? "Registering..." : "Register"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

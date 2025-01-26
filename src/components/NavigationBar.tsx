"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { colors } from "@/styles/colors";

export function NavigationBar({
  username,
  isAdmin,
}: {
  username?: string;
  isAdmin?: boolean;
}) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    localStorage.removeItem("isAdmin");
    router.push("/login");
  };

  return (
    <nav className={`${colors.background.primary} shadow-md`}>
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-6">
          {username ? (
            <>
              <Link
                href="/home"
                className={`${colors.text.white} text-lg font-medium transition-colors duration-200 ${colors.interactive.hover.text.light}`}
              >
                Home
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className={`${colors.text.white} text-lg font-medium transition-colors duration-200 ${colors.interactive.hover.text.light}`}
                >
                  Dashboard
                </Link>
              )}
              <span className={`${colors.text.blue.light} text-lg`}>
                Welcome, <span className="font-semibold">{username}</span>
              </span>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={`${colors.text.white} text-lg font-medium transition-colors duration-200 ${colors.interactive.hover.text.light}`}
              >
                Login
              </Link>
              <Link
                href="/register"
                className={`${colors.text.white} text-lg font-medium transition-colors duration-200 ${colors.interactive.hover.text.light}`}
              >
                Register
              </Link>
            </>
          )}
        </div>
        {username && (
          <button
            onClick={handleLogout}
            className={`rounded-md ${colors.background.card} px-4 py-2 ${colors.text.blue.primary} font-medium transition-all duration-200 ${colors.interactive.hover.bg.light} hover:shadow-md focus:outline-none focus:ring-2 ${colors.ring.focus.white} focus:ring-offset-2 ${colors.ring.focus.offset.blue}`}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

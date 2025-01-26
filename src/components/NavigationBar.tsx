"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { colors } from "@/styles/colors";
import { useTranslation, type Language } from "@/utils/i18n";

export function NavigationBar({
  username,
  isAdmin,
}: {
  username?: string;
  isAdmin?: boolean;
}) {
  const router = useRouter();
  const { t, language, setLanguage } = useTranslation();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    localStorage.removeItem("isAdmin");
    router.push("/login");
  };

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
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
                {t("home")}
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className={`${colors.text.white} text-lg font-medium transition-colors duration-200 ${colors.interactive.hover.text.light}`}
                >
                  {t("dashboard")}
                </Link>
              )}
              <span className={`${colors.text.blue.light} text-lg`}>
                {t("welcome")}, <span className="font-semibold">{username}</span>
              </span>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={`${colors.text.white} text-lg font-medium transition-colors duration-200 ${colors.interactive.hover.text.light}`}
              >
                {t("login")}
              </Link>
              <Link
                href="/register"
                className={`${colors.text.white} text-lg font-medium transition-colors duration-200 ${colors.interactive.hover.text.light}`}
              >
                {t("register")}
              </Link>
            </>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {!isAdmin && (
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value as Language)}
              className={`rounded-md ${colors.background.card} px-2 py-1 text-sm ${colors.text.blue.primary} focus:outline-none focus:ring-2 ${colors.ring.focus.blue}`}
            >
              <option value="en">English</option>
              <option value="zh">中文</option>
            </select>
          )}
          {username && (
            <button
              onClick={handleLogout}
              className={`rounded-md ${colors.background.card} px-4 py-2 ${colors.text.blue.primary} font-medium transition-all duration-200 ${colors.interactive.hover.bg.light} hover:shadow-md focus:outline-none focus:ring-2 ${colors.ring.focus.white} focus:ring-offset-2 ${colors.ring.focus.offset.blue}`}
            >
              {t("logout")}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

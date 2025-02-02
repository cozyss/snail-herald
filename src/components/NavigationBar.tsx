"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
      <div className="container mx-auto flex items-center justify-between px-3 py-2 sm:px-6 sm:py-4">
        <div className="flex items-center space-x-2 sm:space-x-6">
          <div className="relative h-6 w-6 sm:h-8 sm:w-8">
            <Image
              src="/logo-white.png"
              alt="Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          {username ? (
            <>
              <Link
                href="/home"
                className={`${colors.text.white} text-sm sm:text-lg font-medium transition-colors duration-200 ${colors.interactive.hover.text.light}`}
              >
                {t("home")}
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className={`${colors.text.white} text-sm sm:text-lg font-medium transition-colors duration-200 ${colors.interactive.hover.text.light}`}
                >
                  {t("dashboard")}
                </Link>
              )}
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={`${colors.text.white} text-sm sm:text-lg font-medium transition-colors duration-200 ${colors.interactive.hover.text.light}`}
              >
                {t("login")}
              </Link>
              <Link
                href="/register"
                className={`${colors.text.white} text-sm sm:text-lg font-medium transition-colors duration-200 ${colors.interactive.hover.text.light}`}
              >
                {t("register")}
              </Link>
            </>
          )}
        </div>
        <div className="flex items-center space-x-4 sm:space-x-6">
          {!isAdmin && (
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value as Language)}
              className={`rounded-lg border border-emerald-700 ${colors.background.primary} px-2 py-1 text-sm ${colors.text.white} focus:outline-none focus:ring-2 ${colors.ring.focus.white} cursor-pointer transition-all duration-200 hover:border-emerald-600`}
            >
              <option value="en" className={colors.background.primary}>EN</option>
              <option value="zh" className={colors.background.primary}>中</option>
            </select>
          )}
          {username && (
            <button
              onClick={handleLogout}
              className={`${colors.text.white} text-sm sm:text-base underline underline-offset-2 hover:text-emerald-100 transition-colors duration-200 focus:outline-none focus:ring-2 ${colors.ring.focus.white} rounded px-1`}
            >
              {t("logout")}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

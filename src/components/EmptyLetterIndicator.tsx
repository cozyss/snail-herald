"use client";

import { colors } from "@/styles/colors";
import { useTranslation } from "@/utils/i18n";

export function EmptyLetterIndicator() {
  const { t } = useTranslation();

  return (
    <div className="mb-4 w-full">
      <div
        className={`relative min-h-[100px] w-full cursor-default rounded-lg border ${colors.border.card.normal} ${colors.background.card} p-6 ${colors.shadow.sm} opacity-70`}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className={`text-lg font-medium ${colors.text.muted}`}>
              ✉️ {t("incomingLetters")}
            </div>
            <div className={`mt-2 text-sm ${colors.text.muted}`}>
              {t("lettersOnTheWay")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

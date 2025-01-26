import { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  safelist: [
    // Text colors
    "text-gray-900",
    "text-gray-700",
    "text-gray-500",
    "text-red-600",
    "text-white",
    "text-teal-600",
    "text-teal-100",
    "text-teal-800",
    "text-gray-800",
    "text-gray-400",

    // Background colors
    "bg-gray-50",
    "bg-white",
    "bg-teal-600",
    "bg-teal-700",
    "bg-teal-400",
    "bg-teal-100",
    "bg-gray-100",
    "bg-black/40",
    "bg-teal-50",

    // New background color variations
    // Blue
    "bg-blue-100",
    "bg-blue-200",
    "bg-blue-300",
    "bg-blue-400",
    "bg-blue-500",
    "bg-blue-600",
    "bg-blue-700",
    "bg-blue-800",
    "bg-blue-900",
    // Green
    "bg-green-100",
    "bg-green-200",
    "bg-green-300",
    "bg-green-400",
    "bg-green-500",
    "bg-green-600",
    "bg-green-700",
    "bg-green-800",
    "bg-green-900",
    // Yellow
    "bg-yellow-100",
    "bg-yellow-200",
    "bg-yellow-300",
    "bg-yellow-400",
    "bg-yellow-500",
    "bg-yellow-600",
    "bg-yellow-700",
    "bg-yellow-800",
    "bg-yellow-900",
    // Orange
    "bg-orange-50",
    "bg-orange-100",
    "bg-orange-200",
    "bg-orange-300",
    "bg-orange-400",
    "bg-orange-500",
    "bg-orange-600",
    "bg-orange-700",
    "bg-orange-800",
    "bg-orange-900",
    // Lime
    "bg-lime-100",
    "bg-lime-200",
    "bg-lime-300",
    "bg-lime-400",
    "bg-lime-500",
    "bg-lime-600",
    "bg-lime-700",
    "bg-lime-800",
    "bg-lime-900",
    // Emerald
    "bg-emerald-100",
    "bg-emerald-200",
    "bg-emerald-300",
    "bg-emerald-400",
    "bg-emerald-500",
    "bg-emerald-600",
    "bg-emerald-700",
    "bg-emerald-800",
    "bg-emerald-900",
    // Red
    "bg-red-100",
    "bg-red-200",
    "bg-red-300",
    "bg-red-400",
    "bg-red-500",
    "bg-red-600",
    "bg-red-700",
    "bg-red-800",
    "bg-red-900",

    // Amber
    "bg-amber-50",
    "bg-amber-100",
    "bg-amber-200",
    "bg-amber-300",
    "bg-amber-400",
    "bg-amber-500",
    "bg-amber-600",
    "bg-amber-700",
    "bg-amber-800",
    "bg-amber-900",

    // Hover states
    "hover:bg-teal-700",
    "hover:bg-gray-50",
    "hover:text-teal-700",
    "hover:text-teal-100",
    "hover:bg-teal-50",
    "hover:border-teal-200",
    "hover:shadow-lg",
    "hover:bg-orange-600",

    // Border colors
    "border-gray-300",
    "border-red-500",
    "border-gray-200",
    "border-teal-200",

    // Focus states
    "focus:ring-teal-600",
    "focus:ring-white",
    "focus:ring-offset-teal-600",

    // Divide colors
    "divide-gray-200",

    // Shadows
    "shadow-sm",
    "shadow-md",
    "shadow-lg",

    // Placeholder
    "placeholder:text-gray-400",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
} satisfies Config;

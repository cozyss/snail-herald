import { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  safelist: [
    // Text colors
    'text-gray-900',
    'text-gray-700',
    'text-gray-500',
    'text-red-600',
    'text-white',
    'text-blue-600',
    'text-blue-100',
    'text-blue-800',
    'text-gray-800',
    'text-gray-400',
    'text-green-800',
    'text-green-100',
    
    // Background colors
    'bg-gray-50',
    'bg-white',
    'bg-green-900',
    'bg-green-800',
    'bg-green-700',
    'bg-blue-100',
    'bg-gray-100',
    'bg-black/40',
    'bg-green-50',
    
    // Hover states
    'hover:bg-green-800',
    'hover:bg-gray-50',
    'hover:text-green-800',
    'hover:text-green-100',
    'hover:bg-green-50',
    'hover:border-blue-200',
    'hover:shadow-lg',
    
    // Border colors
    'border-gray-300',
    'border-red-500',
    'border-gray-200',
    'border-blue-100',
    
    // Focus states
    'focus:ring-green-900',
    'focus:ring-white',
    'focus:ring-offset-green-900',
    
    // Divide colors
    'divide-gray-200',
    
    // Shadows
    'shadow-sm',
    'shadow-md',
    'shadow-lg'
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

// This file contains all the color classes used throughout the application

export const colors = {
  // Text colors for different purposes
  text: {
    primary: "text-gray-900", // Main text color for headings and important content
    secondary: "text-gray-700", // Secondary text for regular content
    muted: "text-gray-500", // Muted text for less important information
    error: "text-red-600", // Error messages
    white: "text-white", // White text for dark backgrounds
    blue: {
      primary: "text-teal-600", // Primary teal text (formerly blue)
      light: "text-teal-100", // Light teal text for contrast on dark backgrounds
    },
  },

  // Background colors
  background: {
    page: "bg-amber-50", // Main page background
    card: "bg-white", // Card/container backgrounds
    primary: "bg-emerald-800", // Primary action backgrounds
    secondary: "bg-orange-400", // Secondary action backgrounds
    hover: {
      primary: "hover:bg-orange-600", // Hover state for primary buttons
      card: "hover:bg-gray-50", // Hover state for cards
    },
    disabled: "bg-gray-400", // Disabled state for buttons
    notification: "bg-red-500", // Notification dot
    badge: {
      admin: "bg-teal-100", // Admin badge background
      user: "bg-gray-100", // User badge background
    },
    backdrop: "bg-black/40", // Modal backdrop with opacity
  },

  // Border colors and styles
  border: {
    input: {
      normal: "border-gray-300", // Default input borders
      error: "border-red-500", // Error state borders
      focus: "focus:ring-teal-600", // Focus state ring color
    },
    card: {
      normal: "border-gray-200", // Card borders
      hover: "hover:border-emerald-400", // Card hover state borders
    },
    divider: "divide-gray-200", // Divider lines
  },

  // Shadow utilities
  shadow: {
    sm: "shadow-sm", // Small shadow
    md: "shadow-md", // Medium shadow
    hover: "hover:shadow-lg", // Shadow on hover
  },

  // Badge text colors
  badge: {
    admin: "text-teal-800", // Admin badge text
    user: "text-gray-800", // User badge text
  },

  // Ring focus styles
  ring: {
    focus: {
      blue: "focus:ring-teal-600", // Focus ring
      white: "focus:ring-white", // White focus ring
      offset: {
        blue: "focus:ring-offset-teal-600", // Offset for focus ring
      },
    },
  },

  // Interactive states
  interactive: {
    hover: {
      text: {
        blue: "hover:text-teal-700", // Text hover
        light: "hover:text-teal-100", // Light text hover
        orange: "hover:text-orange-600", // Text hover
      },
      bg: {
        blue: "hover:bg-teal-700", // Background hover
        light: "hover:bg-teal-50", // Light background hover
        orange: "hover:bg-orange-600", // Background hover
      },
    },
  },

  // Form input styles
  input: {
    placeholder: "placeholder:text-gray-400", // Placeholder text color
  },
};

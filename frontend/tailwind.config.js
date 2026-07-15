/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#2563EB",
          600: "#1D4ED8",
          700: "#1e40af",
        },
        bg: "#F8FAFC",
        sidebar: "#FFFFFF",
        card: "#FFFFFF",
        border: "#E2E8F0",
        ink: {
          DEFAULT: "#0F172A",
          muted: "#64748B",
        },
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        info: "#3B82F6",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        soft: "0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)",
        lift: "0 10px 30px rgba(15,23,42,0.10)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

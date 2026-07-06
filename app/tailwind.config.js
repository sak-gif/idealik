/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#C2A86F",
        "primary-dark": "#705c2a",
        surface: "#F9F9F9",
        "surface-container": "#EEEEEE",
        "surface-input": "#F2F2F2",
        "text-main": "#1A1C1C",
        "text-muted": "#4C463A",
        "text-light": "#7E7669",
        "outline-variant": "#CFC5B6",
        pending: "#F4900C",
        confirmed: "#5E5E5E",
        error: "#BA1A1A",
      },
      fontFamily: {
        heading: ['Manrope', 'sans-serif'],
        label: ['Hanken Grotesk', 'sans-serif'],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06)",
        "card-hover": "0 4px 20px rgba(0,0,0,0.08)",
        interactive: "0 2px 8px rgba(0,0,0,0.1)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        sparkle: "sparkle 2s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        sparkle: {
          "0%, 100%": { opacity: "0.2", transform: "scale(0.7) rotate(0deg)" },
          "50%": { opacity: "0.8", transform: "scale(1.1) rotate(15deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};

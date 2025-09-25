/* tailwind.config.js */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        tertiary: "var(--color-tertiary)",
        background: "var(--color-bg)",
        "background-alt": "var(--color-bg-alt)",
        "text-main": "var(--color-text)",
        "text-sub": "var(--color-subtext)",
        accent: "var(--color-accent)",
      },
    },
  },
  plugins: [],
};

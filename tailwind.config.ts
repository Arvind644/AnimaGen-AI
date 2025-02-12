import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
  ],
  safelist: [
    'bg-red-100',
    'text-red-800',
    'bg-green-100',
    'text-green-800',
    'bg-blue-100',
    'text-blue-800',
    'from-indigo-500',
    'to-purple-600',
    'from-indigo-600',
    'to-purple-600',
    'from-indigo-700',
    'to-purple-700',
    'from-green-600',
    'to-teal-600',
    'from-green-700',
    'to-teal-700',
  ],
};

export default config;

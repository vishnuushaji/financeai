import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          50: "hsl(214 100% 97%)",
          100: "hsl(214 95% 93%)",
          200: "hsl(214 87% 85%)",
          300: "hsl(214 82% 75%)",
          400: "hsl(214 80% 65%)",
          500: "hsl(214.3 83.2% 57.6%)",
          600: "hsl(214.3 83.2% 52.6%)",
          700: "hsl(214.3 83.2% 42.6%)",
          800: "hsl(214.3 83.2% 32.6%)",
          900: "hsl(214.3 83.2% 12%)",
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        success: {
          500: "hsl(160 84% 39%)",
          600: "hsl(160 84% 34%)",
        },
        slate: {
          50: "hsl(210 40% 98%)",
          100: "hsl(210 40% 95%)",
          200: "hsl(214.3 31.8% 91.4%)",
          300: "hsl(212.7 26.8% 83.9%)",
          400: "hsl(215.4 16.3% 56.9%)",
          500: "hsl(215.4 16.3% 46.9%)",
          600: "hsl(215.4 16.3% 36.9%)",
          700: "hsl(215.3 19.3% 34.5%)",
          800: "hsl(215.3 25% 26.7%)",
          900: "hsl(222.2 84% 4.9%)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;

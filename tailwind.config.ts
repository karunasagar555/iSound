import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        systembgLight : {
          300 : "#FFFFFFFF",
          200 : "#F2F2F7FF",
          100 : "#FFFFFFFF",
        },
        systembgDark : {
          300 : "#000000FF",
          200 : "#1C1C1EFF",
          100 : "#2C2C2EFF",
        },
        systemGbgLight : {
          300 : "#F2F2F7FF",
          200 : "#FFFFFFFF",
          100 : "#F2F2F7FF",
        },
        systemGbgDark : {
          300 : "#000000FF",
          200 : "#1C1C1EFF",
          100 : "#2C2C2EFF",
        },
        systemLbLight : {
          400 : "#000000FF",
          300 : "#3C3C4399",
          200 : "#3C3C434D",
          100 : "#3C3C432E",
          placeh: "#3C3C434D",
        },
        systemLbDark : {
          400 : "#FFFFFFFF",
          300 : "#EBEBF599",
          200 : "#EBEBF54D",
          100 : "#EBEBF52E",
          placeh: "#EBEBF54D",
        },
        systemGrayLight : {
          600 : "#8E8E93FF",
          500 : "#AEAEB2FF",
          400 : "#C7C7CCFF",
          300 : "#D1D1D6FF",
          200 : "#E5E5EAFF",
          100 : "#F2F2F7FF",
        },
        systemGrayDark : {
          600 : "#8E8E93FF",
          500 : "#636366FF",
          400 : "#48484AFF",
          300 : "#3A3A3CFF",
          200 : "#2C2C2EFF",
          100 : "#1C1C1EFF",
        },
        systemSepDark : {
          sep: "#54545899",
          opaque: "#38383AFF",
        },
        systemSepLight : {
          sep: "#3C3C434A",
          opaque: "#C6C6C8FF",
        },
        systemTintLight:{
          pink: "#FF2D55FF",
          purple: "#AF52DEFF",
          orange: "#FF9500FF",
          yellow: "#FFCC00FF",
          red:"#FF3B30FF",
          teal: "#5AC8FAFF",
          blue: "#007AFFFF",
          green: "#34C759FF",
          indigo: "#5856D6FF"
        },
        systemTintDark:{
          pink: "#FF375FFF",
          purple: "#BF5AF2FF",
          orange: "#FF9F0AFF",
          yellow: "#FFD60AFF",
          red:"#FF453AFF",
          teal: "#64D2FFFF",
          blue: "#0A84FFFF",
          green: "#30D158FF",
          indigo: "#5E5CE6FF"
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fill: {
          "0%, 100%": {
            background: "radial-gradient(circle, #000 0%, #000 100%)",
          },
        },
        bouncex: {
          "0%, 100%": {
            transform: 'translateX(-25%)',
            'animation-timing-function': 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateX(0)',
            'animation-timing-function': 'cubic-bezier(0, 0, 0.2, 1)',
          }
        },
        moveGradient: {
          "0%": {
            'background-position':'0% 50%'
          },
          "50%": {
            'background-position': '100% 50%'
          },
          '100%': {
            'background-position': '0% 50%'
          }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fill-radial": "fill 2s forwards",
        "bouncex": 'bouncex 1s infinite',
        "animate-gradient": 'moveGradient 15s ease 0s infinite normal none running'
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
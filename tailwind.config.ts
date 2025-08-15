import type { Config } from "tailwindcss"
import typography from '@tailwindcss/typography'

const config = {
  darkMode: "class",
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        "light-primary": "#E1EAD7",
        "light-secondary": "#98A886",
        "light-accent": "#EC4899",
        "light-text": "#1F2937",
        "dark-primary": "#1F2937",
        "dark-secondary": "#374151",
        "dark-accent": "#F9A8D4",
        "dark-text": "#F3F4F6",
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        }
      }
    }
  },
  plugins: [typography],
} satisfies Config

export default config
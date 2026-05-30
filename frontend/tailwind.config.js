/** @type {import('tailwindcss').Config} */
export default {
  // Enable manual dark mode toggle (use 'media' if you prefer OS preference)
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // 🎨 SLB Brand Colors (mapped to CSS variables for dynamic theming)
        slb: {
          navy: 'var(--slb-navy)',
          'navy-light': 'var(--slb-navy-light)',
          'navy-lighter': 'var(--slb-navy-lighter)',
          'navy-900': 'var(--slb-navy-900)',
          'navy-800': 'var(--slb-navy-800)',
          'navy-700': 'var(--slb-navy-700)',
          'navy-600': 'var(--slb-navy-600)',
          blue: {
            500: 'var(--slb-blue-500)',
            400: 'var(--slb-blue-400)',
          },
          cyan: {
            400: 'var(--slb-cyan-400)',
            300: 'var(--slb-cyan-300)',
          },
          gray: {
            50: 'var(--slb-gray-50)',
            100: 'var(--slb-gray-100)',
            200: 'var(--slb-gray-200)',
            300: 'var(--slb-gray-300)',
            500: 'var(--slb-gray-500)',
            700: 'var(--slb-gray-700)',
            900: 'var(--slb-gray-900)',
          },
          accent: 'var(--slb-accent)',
          'accent-light': 'var(--slb-accent-light)',
          success: 'var(--slb-success)',
          warning: 'var(--slb-warning)',
          error: 'var(--slb-error)',
          info: 'var(--slb-info)',
        },

        // 🖼️ Semantic Surfaces & Text (recommended for consistent UI)
        surface: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        border: {
          light: 'var(--border-light)',
          medium: 'var(--border-medium)',
          focus: 'var(--border-focus)',
        },
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },

      fontSize: {
        xs: 'var(--text-xs)',
        sm: 'var(--text-sm)',
        base: 'var(--text-base)',
        lg: 'var(--text-lg)',
        xl: 'var(--text-xl)',
        '2xl': 'var(--text-2xl)',
        '3xl': 'var(--text-3xl)',
        '4xl': 'var(--text-4xl)',
        '5xl': 'var(--text-5xl)',
      },

      spacing: {
        xs: 'var(--space-xs)',
        sm: 'var(--space-sm)',
        md: 'var(--space-md)',
        lg: 'var(--space-lg)',
        xl: 'var(--space-xl)',
        '2xl': 'var(--space-2xl)',
        '3xl': 'var(--space-3xl)',
        '4xl': 'var(--space-4xl)',
      },

      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },

      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        glow: 'var(--shadow-glow)',
        neon: 'var(--shadow-glow)',
        'neon-sm': '0 0 12px rgba(6, 182, 212, 0.12)',
      },

      transitionDuration: {
        fast: 'var(--transition-fast)',
        base: 'var(--transition-base)',
        slow: 'var(--transition-slow)',
      },

      animation: {
        fadeInUp: "fadeInUp 0.6s ease-out forwards",
        slideInLeft: "slideInLeft 0.5s ease-out forwards",
        slideInRight: "slideInRight 0.5s ease-out forwards",
        float: "float 3s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite",
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
        fadeIn: "fadeIn 0.4s ease-out forwards",
        slideInDown: "slideInDown 0.4s ease-out forwards",
        slideInUp: "slideInUp 0.4s ease-out forwards",
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          from: { opacity: "0", transform: "translateX(-20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          from: { opacity: "0", transform: "translateX(20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideInDown: {
          from: { opacity: "0", transform: "translateY(-20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideInUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 10px rgba(6, 182, 212, 0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(6, 182, 212, 0.6)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
    },
  },
  plugins: [],
}

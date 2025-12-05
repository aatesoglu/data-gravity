const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                space: {
                    950: '#050a14', // Deepest background
                    900: '#0A1929', // Primary background
                    800: '#1A2332', // Secondary background (panels)
                    700: '#2A3445', // Borders/Separators
                    600: '#3A4556', // Interactables (Scrollbar hover)
                },
                cyan: {
                    400: '#22d3ee',
                    500: '#00D9FF', // Electric Cyan (Primary Accent)
                    600: '#00B4D8',
                },
                violet: {
                    500: '#6366F1', // Secondary Accent
                    600: '#8B5CF6',
                },
            },
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
                mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'spin-slow': 'spin 8s linear infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                }
            },
            backdropBlur: {
                xs: '2px',
            }
        },
    },
    plugins: [],
}

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    // Styles for the App

    // Grays
    'bg-gray_200',
    'bg-gray_300',
    'text-gray_400',
    'text-gray_500',
    'bg-black/2',

    // Blues
    'bg-blue_100',
    'bg-blue_200',
    'bg-blue_300',
    'text-blue_400',
    'text-blue_500',

    // Brand (primary)
    'bg-brand_100',
    'text-brand_300',
    'text-brand_500',

    // Reds
    'bg-red_50',
    'text-red_200',
  ],
  theme: {
    extend: {
      colors: {
        // blacks
        black_10: '#1A1818',

        // Grays (cool slate)
        gray_10: '#E2E8F0',
        gray_25: '#FAFCFF',
        gray_50: '#F8FAFC',
        gray_75: '#F1F5F9',
        gray_100: '#F5F7FB',
        gray_150: '#EEF2F7',
        gray_160: '#E9EEF6',
        gray_200: '#E2E8F0',
        gray_300: '#CBD5E1',
        gray_350: '#BFCADC',
        gray_400: '#94A3B8',
        gray_500: '#7B8AA0',
        gray_600: '#64748B',
        gray_700: '#475569',
        gray_750: '#334155',
        gray_800: '#1E293B',
        gray_850: '#172033',
        gray_900: '#0F172A',

        // Accent (lilac — aligned with brand scale)
        blue_50: '#F4EEF7',
        blue_100: '#E1CEE8',
        blue_200: '#CEAFD9',
        blue_300: '#BB90CB',
        blue_400: '#A871BC',
        blue_500: '#9552AD',
        blue_600: '#7F4694',
        blue_700: '#5F346F',

        // Brand (lilac / plum)
        brand_50: '#F4EEF7',
        brand_100: '#E1CEE8',
        brand_200: '#CEAFD9',
        brand_300: '#BB90CB',
        brand_400: '#A871BC',
        brand_500: '#9552AD',
        brand_600: '#7F4694',
        brand_700: '#5F346F',
        brand_800: '#452650',
        brand_900: '#2A1731',
        brand_950: '#0F0811',

        // oranges
        orange_300: '#FDBA742E',
        orange: '#FB923C',

        // Reds
        red_50: '#FEE2E2',
        red_100: '#F87171',
        red_200: '#EF4444',
        red_300: '#FCA5A54D',
        red_900: '#7F1D1D',

        // Warning (lilac accent — KPI highlights)
        warning_50: '#F4EEF7',
        warning_100: '#E1CEE8',
        warning_200: '#CEAFD9',
        warning_700: '#5F346F',
        warning_800: '#452650',
        warning_900: '#2A1731',

        // Success
        success_50: '#DCFCE7',
        success_100: '#BBF7D0',
        success_500: '#22C55E',
        success_700: '#15803D',

        // Base colors
        black: '#000000',
        white: '#FFFFFF',
      },
      backgroundImage: {
        linearGradientBlue: 'linear-gradient(135deg, #A871BC, #9552AD, #5F346F)',
      },
      fontSize: {
        'cp-xl': '22px',
      },
    },
  },
  plugins: [
    function ({ addBase, theme }) {
      addBase({
        ':root': {
          // Grays
          '--gray_300': theme('colors.gray_300'),
          '--gray_800': theme('colors.gray_800'),

          // Blues
          '--blue_300': '#BB90CB',
          '--blue_400': theme('colors.blue_400'),
          '--blue_500': theme('colors.blue_500'),

          // Brand
          '--brand_400': theme('colors.brand_400'),

          // Reds
          '--red_400': '#EF4444',

          // Base colors
          '--white': '#FFFFFF',
          '--purple_400': '#8884d8',
        },
        '::-webkit-scrollbar': {
          width: '8px',
        },
        '::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '::-webkit-scrollbar-thumb': {
          background: theme('colors.gray_600'),
          borderRadius: theme('borderRadius.full'),
        },
        '::-webkit-scrollbar-thumb:hover': {
          background: theme('colors.gray_600'),
        },
        '*': {
          'scrollbar-width': 'thin',
          'scrollbar-color': `${theme('colors.gray_600')} transparent`,
        },
      })
    },
  ],
};
export default config;
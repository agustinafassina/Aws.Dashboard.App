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

        // Accent (blue scale)
        blue_50: '#EFF6FF',
        blue_100: '#DBEAFE',
        blue_200: '#BFDBFE',
        blue_300: '#93C5FD',
        blue_400: '#60A5FA',
        blue_500: '#3B82F6',
        blue_600: '#2563EB',
        blue_700: '#1D4ED8',

        // Brand (used across interactive surfaces)
        brand_50: '#EFF6FF',
        brand_100: '#DBEAFE',
        brand_200: '#BFDBFE',
        brand_300: '#93C5FD',
        brand_400: '#60A5FA',
        brand_500: '#3B82F6',
        brand_600: '#2563EB',
        brand_700: '#1D4ED8',
        brand_800: '#1E40AF',
        brand_900: '#1E3A8A',
        brand_950: '#172554',

        // oranges
        orange_300: '#FDBA742E',
        orange: '#FB923C',

        // Reds
        red_50: '#FEE2E2',
        red_100: '#F87171',
        red_200: '#EF4444',
        red_300: '#FCA5A54D',
        red_900: '#7F1D1D',

        // Warning (amber scale)
        warning_50: '#FFFBEB',
        warning_100: '#FEF3C7',
        warning_200: '#FDE68A',
        warning_700: '#B45309',
        warning_800: '#92400E',
        warning_900: '#78350F',

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
        linearGradientBlue: 'linear-gradient(135deg, #60A5FA, #3B82F6, #1D4ED8)',
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
          '--blue_300': theme('colors.blue_300'),
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
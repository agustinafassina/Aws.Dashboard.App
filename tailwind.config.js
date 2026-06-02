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

        // Accent (lilac / violet)
        blue_50: '#F6EDF9',
        blue_100: '#EBD9F2',
        blue_200: '#A871BC33',
        blue_300: '#8B4EA533',
        blue_400: '#B985C8',
        blue_500: '#A871BC',
        blue_600: '#8B4EA5',
        blue_700: '#6F3D86',

        // Brand (lilac / plum)
        brand_50: '#F7F0FA',
        brand_100: '#EEDFF4',
        brand_200: '#DABDE7',
        brand_300: '#C498D8',
        brand_400: '#A871BC',
        brand_500: '#8B4EA5',
        brand_600: '#744188',
        brand_700: '#5F346F',
        brand_800: '#4B2859',
        brand_900: '#3A1F45',

        // oranges
        orange_300: '#FDBA742E',
        orange: '#FB923C',

        // Reds
        red_50: '#FEE2E2',
        red_100: '#F87171',
        red_200: '#EF4444',
        red_300: '#FCA5A54D',
        red_900: '#7F1D1D',

        // Warning (lilac accent — KPI highlights, light theme)
        warning_50: '#F6EFFA',
        warning_100: '#EDDFF6',
        warning_200: '#DABDE7',
        warning_700: '#5F346F',
        warning_800: '#452650',
        warning_900: '#452650',

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
        linearGradientBlue: 'linear-gradient(135deg, #A871BC, #5F346F)',
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
          '--blue_300': '#D5B3E2',
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
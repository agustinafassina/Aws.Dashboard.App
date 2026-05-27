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

    // Greens
    'bg-green_100',
    'text-green_300',
    'text-green_500',

    // Reds
    'bg-red_50',
    'text-red_200',
  ],
  theme: {
    extend: {
      colors: {
        // blacks
        black_10: '#1A1818',

        // Grays
        gray_10: '#CDD5DB',
        gray_25: '#F9FAF7',
        gray_50: '#FBFCFA',
        gray_75: '#F5EFF7',
        gray_100: '#FBFBFB',
        gray_150: '#FDFDFC',
        gray_160: '#F2F3ED',
        gray_200: '#ECEDE6',
        gray_300: '#EAEAEA',
        gray_350: '#E5E5E5',
        gray_400: '#C9C9C9',
        gray_500: '#C6C6C6',
        gray_600: '#919191',
        gray_700: '#878787',
        gray_750: '#757575',
        gray_800: '#6D6D6D',
        gray_850: '#5A5A5A',
        gray_900: '#322F35',

        // Blues
        blue_50: '#E2EFFF',
        blue_100: '#E0F7FA',
        blue_200: '#3B7DCC1A',
        blue_300: '#14CBCD1A',
        blue_400: '#14CBCD',
        blue_500: '#3B7DCC',
        blue_600: '#0078D4',
        blue_700: '#0056B3',

        // Greens
        green_50: '#e8f1e9ff',
        green_100: '#4AA77C1A',
        green_200: '#14AE5C',
        green_300: '#4AA77C',
        green_400: '#009951',
        green_500: '#163832',

        // light greens
        lightgreen_300: '#59E6A44D',
        lightgreen: '#22A468',

        // oranges
        orange_300: '#F3BC6E4D',
        orange: '#FFA221',

        // Reds
        red_50: '#EE4E241A',
        red_100: '#D13438',
        red_200: '#EE4E24',
        red_300: '#FF91914D',
        red_900: '#FF2121',

        // Base colors
        black: '#000000',
        white: '#FFFFFF',
      },
      backgroundImage: {
        linearGradientBlue: 'linear-gradient(200deg, #14CBCD, #3B7DCC)',
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
          '--blue_300': '#8DE6E7',
          '--blue_400': theme('colors.blue_400'),
          '--blue_500': theme('colors.blue_500'),

          // Greens
          '--green_400': '#4AA77C',

          // Reds
          '--red_400': '#D13438',

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
/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/**/*.{astro,html,js,jsx,ts,tsx}',
    './public/**/*.{html,js}'
  ],
  darkMode: ['class', '.dark'],
  theme: { extend: {} },
  plugins: [],
};

export default config;

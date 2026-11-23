/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#D95F1A', // Official AMRUT/Gov Saffron Orange
          primaryHover: '#C24F11',
          secondary: '#136938', // Confirmed states & Tiranga Green
          secondaryHover: '#0E522B',
          tertiary: '#F59E0B',
          neutral: '#0F172A',
          canvas: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
          subtle: '#64748B',
          govSaffron: '#D95F1A',
          govSaffronDark: '#B84A0E',
          govCream: '#FAF7F2',
          govCreamBorder: '#F0EBE1',
        },
      },
      fontFamily: {
        sans: ['Mukta', 'Inter', '"Noto Sans Devanagari"', 'sans-serif'],
        controls: ['Inter', 'Mukta', '"Noto Sans Devanagari"', 'sans-serif'],
        poppins: ['Mukta', 'Inter', '"Noto Sans Devanagari"', 'sans-serif'],
      },
      borderRadius: {
        panel: '12px',
      },
    },
  },
  plugins: [],
};

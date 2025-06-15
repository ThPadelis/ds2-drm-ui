/** @type {import('tailwindcss').Config} */
import PrimeUI from 'tailwindcss-primeui';
export default {
    darkMode: ['selector', '[class*="app-dark"]'],
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    plugins: [PrimeUI],
    theme: {
        screens: {
            sm: '576px',
            md: '768px',
            lg: '992px',
            xl: '1200px',
            '2xl': '1920px'
        },
        extend: {
            boxShadow: {
                custom: '0px 12px 24px -4px rgba(145, 158, 171, 0.12), 0px 0px 2px 0px rgba(145, 158, 171, 0.20)',
                'custom-xl': '0px 0px 14px 5px rgba(0, 0, 0, 0.11)'
            },
            bg: {
                white: '#ffffff'
            }
        }
    }
};

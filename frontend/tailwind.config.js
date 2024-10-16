/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cgray: '#d9c9c9',
        cgreen: '#4BB543',
      },
      backgroundColor: {
        'cdark-100': '#161616',
        'cdark-200': '#222630',
      },
        backgroundImage: {
        'custom-gradient-1': 'linear-gradient(to right, #0f0c29, #302b63, #24243e)',
        'custom-gradient-2': 'linear-gradient(to top right, #262157, #3D3960, #090626)',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
      },
      
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: false, // Disable all DaisyUI themes
    // Optionally enable just a specific set of DaisyUI components you want
    styled: false, // Enable/disable DaisyUI styling
    base: false,   // Enable/disable base styles
    utils: true,  // Enable/disable utility classes
    logs: false,  // Disable DaisyUI logs
  },
}
/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				giest: ['var(--font-primary)', 'sans-serif'],
				scribble2: ['var(--font-secondary)', 'sans-serif']
			},
			textColor: {
				'giest-100': '#A1A1A1',
				'giest-200': '#EDEDED',
				'giest-300': '#6b7280',
				'giest-400': '#95959D'
			},
			colors: {
				cgray: '#d9c9c9',
				cgreen: '#4BB543',
				'cgray-100': '#252525',

				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			borderColor: {
				alphaborder: '#272727',
				'b-dark-100': '#596A95',
				'b-dark-200': '#413d3d'
			},
			backgroundColor: {
				'cdark-100': '#161616',
				'cdark-200': '#222630',
				'cdark-300': '#09090B',
			},
			backgroundImage: {
				'custom-gradient-1': 'linear-gradient(to right, #0f0c29, #302b63, #24243e)',
				'custom-gradient-2': 'linear-gradient(to top right, #262157, #3D3960, #090626)'
			},
			keyframes: {
				shimmer: {
					'0%': {
						transform: 'translateX(-100%)'
					},
					'100%': {
						transform: 'translateX(100%)'
					}
				}
			},
			animation: {
				shimmer: 'shimmer 2s infinite'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	plugins: [
		// require('daisyui'),
		// require("tailwindcss-animate")
	],
	// daisyui: {
	// 	themes: false, // Disable all DaisyUI themes
	// 	// Optionally enable just a specific set of DaisyUI components you want
	// 	styled: false, // Enable/disable DaisyUI styling
	// 	base: false,   // Enable/disable base styles
	// 	utils: true,  // Enable/disable utility classes
	// 	logs: false,  // Disable DaisyUI logs
	// },
}
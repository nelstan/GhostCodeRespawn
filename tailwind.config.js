/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	mode: 'jit',
	plugins: [
		function ({ addUtilities, theme }) {
			const newUtilities = {}
			const textShadows = theme('textShadow')
			for (const key in textShadows) {
				newUtilities[`.text-shadow-${key}`] = {
					textShadow: textShadows[key],
				}
			}
			addUtilities(newUtilities)
		},
		function ({ addComponents }) {
			addComponents({
				'.text-gradient': {
					background: 'linear-gradient(to right, #FF7096, #FF8FAB)',
					'-webkit-background-clip': 'text',
					'-webkit-text-fill-color': 'transparent',
				},
			})
		},
	],
	theme: {
		extend: {
			fontFamily: {
				exo: ['"Exo 2"', 'sans-serif'],
				montserrat: ['"Montserrat"', 'sans-serif'],
				custom: ['Palatino-Linotype', 'sans-serif'],
			},
			backgroundImage: {
				'text-gradient': 'linear-gradient(to right, #FF7096, #FF8FAB)',
			},
			textShadow: {
				sm: '1px 1px 2px black',
				DEFAULT: '0 0 8px #007bff',
				lg: '1px 1px 16px #9AFE81',
				'4xl': '2px 2px 8px rgba(0, 0, 0, 0.5)',
			},
		},
	},
}

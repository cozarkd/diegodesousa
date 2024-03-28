/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				blue: '#1536f1',
				purple: '#920de9',
				lightpurple: '#d39ef6'
				
			}
		},
	},
	plugins: [
		require('tailwindcss-animated'),
	],
}

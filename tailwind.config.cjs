// tailwind.config.cjs
/** @type {import('tailwindcss').Config} */

const seasonalStylesPlugin = require('./plugins/tailwind/seasonalStylesPlugin.js')
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))'
			}
		}
	},
	plugins: [
		seasonalStylesPlugin
	]
}

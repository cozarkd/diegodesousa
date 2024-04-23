/** @type {import("prettier").Config} */
module.exports = {

	...require('prettier-config-standard'),
	// pluginSearchDirs: [__dirname],
	plugins: [require.resolve('prettier-plugin-astro'), "prettier-plugin-tailwindcss", require.resolve('prettier-plugin-css-order')],
	overrides: [
		{
			files: '*.astro',
			options: {
				parser: 'astro'
			}
		}
	]
}

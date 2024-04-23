module.exports = {
	plugins: [
		// add PostCSS preset-env
		require('postcss-preset-env', {

			// Options
			stage: 2,
		}),
		require('autoprefixer')
	]
}

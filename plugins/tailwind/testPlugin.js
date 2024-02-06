import plugin from 'tailwindcss/plugin'

const testPlugin = plugin(function ({ addBase }) {
	addBase({
		body: { backgroundColor: 'purple' }
	})
})

module.exports = testPlugin

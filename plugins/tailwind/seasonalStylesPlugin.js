/* eslint-disable brace-style */
import plugin from 'tailwindcss/plugin'

const seasonalStylesPlugin = plugin(function ({ addBase, theme }) {
	const now = new Date()
	const month = now.getMonth() + 1 // JavaScript cuenta los meses desde 0
	const day = now.getDate()

	let seasonalStyles = {}

	// Temporada Navideña
	if ((month === 12 && day >= 1) || (month === 1 && day <= 6)) {
		seasonalStyles = {
			':root': {
				'--color-primary': '#ff0000', // Rojo Navidad
				'--color-secondary': '#00ff00' // Verde Navidad
			}
		}
	}
	// Halloween
	else if (month === 10 && day === 31) {
		seasonalStyles = {
			':root': {
				'--color-primary': '#ff7518', // Naranja Halloween
				'--color-secondary': '#000' // Negro Halloween
			}
		}
	}
	// Invierno
	else if ((month === 12 && day >= 21) || month === 1 || month === 2 || (month === 3 && day < 20)) {
		seasonalStyles = {
			':root': {
				'--color-primary': '#00f', // Azul Invierno
				'--color-secondary': '#f55' // Rojo Invierno
			}
		}
	}
	// Primavera
	else if ((month === 3 && day >= 20) || month === 4 || month === 5 || (month === 6 && day < 21)) {
		seasonalStyles = {
			':root': {
				'--color-primary': '#0f0', // Verde Primavera
				'--color-secondary': '#f55' // Rojo Primavera
			}
		}
	}
	// Verano
	else if ((month === 6 && day >= 21) || month === 7 || month === 8 || (month === 9 && day < 23)) {
		seasonalStyles = {
			':root': {
				'--color-primary': '#ff0', // Amarillo Verano
				'--color-secondary': '#f55' // Rojo Verano
			}
		}
	}
	// Otoño
	else if ((month === 9 && day >= 23) || month === 10 || month === 11 || (month === 12 && day < 21)) {
		seasonalStyles = {
			':root': {
				'--color-primary': '#f80', // Naranja Otoño
				'--color-secondary': '#f55' // Rojo Otoño
			}
		}
	}

	addBase(seasonalStyles)
}, {
	theme: {
		extend: {
			colors: {
				primary: 'var(--color-primary)',
				secondary: 'var(--color-secondary)'
			}
		}
	}
})

module.exports = seasonalStylesPlugin

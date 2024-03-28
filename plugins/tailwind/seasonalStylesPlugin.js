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
				'--color-primary': '#B4D2E7', // Azul glaciar
				'--color-secondary': '#D3D3D3', // Gris suave
				'--color-accent': '#9B1D20' // Rojo Baya
			}
		}
	}
	// Primavera
	else if ((month === 3 && day >= 20) || month === 4 || month === 5 || (month === 6 && day < 21)) {
		seasonalStyles = {
			':root': {
				'--color-primary': '#6BCB77', // Verde Fresco
				'--color-secondary': '#FDE74C', // Amarillo suave
				'--color-accent': '#FA7268' // Coral Brillante

			}
		}
	}
	// Verano
	else if ((month === 6 && day >= 21) || month === 7 || month === 8 || (month === 9 && day < 23)) {
		seasonalStyles = {
			':root': {
				'--color-primary': '#247BA0', // Azul profundo
				'--color-secondary': '#1BE7FF', // Turquesa claro
				'--color-accent': '#FF5714' // Naranja Vibrante
			}
		}
	}
	// Otoño
	else if ((month === 9 && day >= 23) || month === 10 || month === 11 || (month === 12 && day < 21)) {
		seasonalStyles = {
			':root': {
				'--color-primary': '#C05805', // Terracota
				'--color-secondary': '#DDA15E', // Beige Suave
				'--color-accent': '#4C6A2A' // Verde Musgo
			}
		}
	}

	addBase(seasonalStyles)
}, {
	theme: {
		extend: {
			colors: {
				primary: 'var(--color-primary)',
				secondary: 'var(--color-secondary)',
				accent: 'var(--color-accent)'
			}
		}
	}
})

module.exports = seasonalStylesPlugin

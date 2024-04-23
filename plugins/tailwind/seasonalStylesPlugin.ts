/* eslint-disable brace-style */
import plugin from 'tailwindcss/plugin'

type SeasonalStyle = {
	'--primary': string;
	'--secondary': string;
	'--accent': string;
	'--background': string;
	'--foreground': string;
};
interface SeasonalStyles {
	[key: string]: SeasonalStyle;
}

const seasonalStylesPlugin = plugin(function ({ addBase }) {
	const now = new Date()
	const month = now.getMonth() + 1 // JavaScript cuenta los meses desde 0
	const day = now.getDate()
	console.log('month', month)
	console.log('day', day)


	let seasonalStyles: SeasonalStyles = {};

	// Temporada Navideña
	if ((month === 12 && day >= 1) || (month === 1 && day <= 6)) {

		// seasonalStyles[':root'] = {

		// 	'--primary': '#ff0000', // Rojo Navidad, hsl(0, 100%, 50%)
		// 	'--secondary': '#00ff00' // Verde Navidad
		// }
	}

	// Halloween
	// else if (month === 10 && day === 31) {
	// 	seasonalStyles = {
	// 		':root': {
	// 			'--primary': '#ff7518', // Naranja Halloween
	// 			'--secondary': '#000' // Negro Halloween
	// 		}
	// 	}
	// }
	// Invierno
	// else if ((month === 12 && day >= 21) || month === 1 || month === 2 || (month === 3 && day < 20)) {
	// 	seasonalStyles = {
	// 		':root': {
	// 			'--primary': '#B4D2E7', // Azul glaciar
	// 			'--secondary': '#D3D3D3', // Gris suave
	// 			'--accent': '#9B1D20' // Rojo Baya
	// 		}
	// 	}
	// }
	// Primavera
	else if ((month === 3 && day >= 20) || month === 4 || month === 5 || (month === 6 && day < 21)) {
		console.log('Es Primavera')
		seasonalStyles = {
			':root': {
				'--primary': '0 0% 9%',
				'--secondary': '0 0% 96.1%',
				'--background': '83 100% 96%',
				'--accent': '4 99% 66%',
				'--foreground': '180 1% 18%'
			},
			'.dark': {
				'--primary': '0 0% 98%',
				'--secondary': '0 0% 14.9%',
				'--background': '180 1% 18%',
				'--accent': '4 99% 66%',
				'--foreground': '0 0% 98%'
			}
		}
	}
	// Verano
	else if ((month === 6 && day >= 21) || month === 7 || month === 8 || (month === 9 && day < 23)) {
		seasonalStyles = {
			// ':root': {
			// 	'--primary': '#247BA0', // Azul profundo
			// 	'--secondary': '#1BE7FF', // Turquesa claro
			// 	'--accent': '#FF5714' // Naranja Vibrante
			// }
		}
	}
	// Otoño
	else if ((month === 9 && day >= 23) || month === 10 || month === 11 || (month === 12 && day < 21)) {
		seasonalStyles = {
			// ':root': {
			// 	'--primary': '#C05805', // Terracota
			// 	'--secondary': '#DDA15E', // Beige Suave
			// 	'--accent': '#4C6A2A' // Verde Musgo
			// }
		}
	}

	addBase(seasonalStyles)
}, {
	theme: {
		extend: {
			colors: {
				primary: 'var(--primary)',
				secondary: 'var(--secondary)',
				accent: 'var(--accent)',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))'
			}
		}
	}
})

module.exports = seasonalStylesPlugin

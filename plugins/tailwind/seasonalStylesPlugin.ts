/* eslint-disable brace-style */
import plugin from 'tailwindcss/plugin'

type SeasonalStyle = {
  '--primary': string
  '--secondary': string
  '--accent': string
  '--background': string
  '--foreground': string
}
interface SeasonalStyles {
  [key: string]: SeasonalStyle
}

const seasonalStylesPlugin = plugin(
  function ({ addBase }) {
    const now = new Date()
    const month = now.getMonth() + 1 // JavaScript cuenta los meses desde 0
    const day = now.getDate()

    // Override month and day for testing
    // const month = 4
    // const day = 31

    let seasonalStyles: SeasonalStyles = {}

    // Navidad
    if ((month === 12 && day >= 1) || (month === 1 && day <= 6)) {
      console.log('Es Navidad')
      seasonalStyles = {
        ':root': {
          '--background': '0 0% 98%', // Blanco para el fondo
          '--foreground': '0 0% 20%', // Gris oscuro para el texto
          '--primary': '0 100% 50%', // Rojo brillante para encabezados H2
          '--secondary': '30 100% 40%', // Naranja oscuro para encabezados H3
          '--accent': '120 100% 25%' // Verde oscuro para botones y enlaces
        },
        '.dark': {
          '--background': '0 0% 20%', // Gris oscuro para el fondo
          '--foreground': '0 0% 98%', // Blanco para el texto
          '--primary': '0 100% 60%', // Rojo claro para encabezados H2
          '--secondary': '30 100% 60%', // Naranja claro para encabezados H3
          '--accent': '120 100% 40%' // Verde claro para botones y enlaces
        }
      }
    }

    // Halloween
    else if (month === 10 && day === 31) {
      console.log('Es Halloween')
      seasonalStyles = {
        ':root': {
          '--background': '40 100% 95%', // Naranja pálido para el fondo
          '--foreground': '240 50% 10%', // Negro azulado para el texto
          '--primary': '25 90% 45%', // Naranja brillante para encabezados H2
          '--secondary': '280 60% 50%', // Morado para encabezados H3
          '--accent': '0 80% 49%' // Rojo anaranjado para botones y enlaces
        },
        '.dark': {
          '--background': '240 50% 10%', // Negro azulado para el fondo
          '--foreground': '40 100% 95%', // Naranja pálido para el texto
          '--primary': '25 90% 60%', // Naranja claro para encabezados H2
          '--secondary': '280 60% 70%', // Morado claro para encabezados H3
          '--accent': '0 80% 70%' // Rojo anaranjado claro para botones y enlaces
        }
      }
    }
    // Invierno
    else if (
      (month === 12 && day >= 21) ||
      month === 1 ||
      month === 2 ||
      (month === 3 && day < 20)
    ) {
      console.log('Es Invierno')
      seasonalStyles = {
        ':root': {
          '--background': '210 100% 97%', // Azul hielo para el fondo
          '--foreground': '210 20% 20%', // Azul oscuro para el texto
          '--primary': '210 70% 50%', // Azul medio para encabezados H2
          '--secondary': '0 0% 40%', // Gris oscuro para encabezados H3
          '--accent': '0 84% 48%' // Rojo brillante para botones y enlaces
        },
        '.dark': {
          '--background': '210 20% 20%', // Azul oscuro para el fondo
          '--foreground': '210 100% 97%', // Azul hielo para el texto
          '--primary': '210 70% 70%', // Azul claro para encabezados H2
          '--secondary': '0 0% 80%', // Gris claro para encabezados H3
          '--accent': '0 84% 70%' // Rojo claro para botones y enlaces
        }
      }
    }

    // Primavera
    else if (
      (month === 3 && day >= 20) ||
      month === 4 ||
      month === 5 ||
      (month === 6 && day < 21)
    ) {
      console.log('Es Primavera')

      seasonalStyles = {
        ':root': {
          '--background': '150 100% 95%', // Verde claro para el fondo
          '--foreground': '150 20% 20%', // Verde oscuro para el texto
          '--primary': '330 70% 50%', // Rosa medio para encabezados H2
          '--secondary': '45 100% 28%', // Amarillo mostaza para encabezados H3
          '--accent': '330 80% 40%' // Rosa oscuro para botones y enlaces
        },
        '.dark': {
          '--background': '150 20% 20%', // Verde oscuro para el fondo
          '--foreground': '150 100% 95%', // Verde claro para el texto
          '--primary': '330 70% 70%', // Rosa claro para encabezados H2
          '--secondary': '60 100% 70%', // Amarillo claro para encabezados H3
          '--accent': '330 90% 80%' // Rosa claro para botones y enlaces
        }
      }
    }
    // Verano
    else if (
      (month === 6 && day >= 21) ||
      month === 7 ||
      month === 8 ||
      (month === 9 && day < 23)
    ) {
      console.log('Es Verano')

      seasonalStyles = {
        ':root': {
          '--background': '45 100% 95%', // Amarillo pálido para el fondo
          '--foreground': '210 15% 25%', // Azul oscuro para el texto
          '--primary': '20 100% 50%', // Naranja brillante para encabezados H2
          '--secondary': '10 90% 60%', // Amarillo dorado para encabezados H3
          '--accent': '4 90% 46%' // Rojo coral para botones y enlaces
        },
        '.dark': {
          '--background': '210 15% 25%', // Azul oscuro para el fondo
          '--foreground': '45 100% 95%', // Amarillo pálido para el texto
          '--primary': '20 100% 70%', // Naranja claro para encabezados H2
          '--secondary': '10 90% 80%', // Amarillo dorado claro para encabezados H3
          '--accent': '4 100% 76%' // Rojo coral claro para botones y enlaces
        }
      }
    }
    // Otoño
    else if (
      (month === 9 && day >= 23) ||
      month === 10 ||
      month === 11 ||
      (month === 12 && day < 21)
    ) {
      console.log('Es Otoño')
      seasonalStyles = {
        ':root': {
          '--background': '35 70% 90%', // Beige pálido para el fondo
          '--foreground': '20 30% 20%', // Marrón oscuro para el texto
          '--primary': '25 93% 45%', // Naranja para encabezados H2
          '--secondary': '35 100% 38%', // Amarillo mostaza para encabezados H3
          '--accent': '10 90% 40%' // Rojo anaranjado para botones y enlaces
        },
        '.dark': {
          '--background': '20 30% 20%', // Marrón oscuro para el fondo
          '--foreground': '35 70% 90%', // Beige pálido para el texto
          '--primary': '25 70% 70%', // Naranja claro para encabezados H2
          '--secondary': '45 80% 70%', // Amarillo mostaza claro para encabezados H3
          '--accent': '10 100% 66%' // Rojo anaranjado claro para botones y enlaces
        }
      }
    }

    addBase(seasonalStyles)
  },
  {
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
  }
)

module.exports = seasonalStylesPlugin

import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";
import tailwindcssNesting from 'tailwindcss/nesting';
import robotsTxt from 'astro-robots-txt';

import robotsConfig from './robots-txt.config';


// https://astro.build/config
export default defineConfig({
	site: 'https://diegodesousa.com',
	integrations: [mdx(), sitemap({
		i18n: {
			defaultLocale: 'es', // All urls that don't contain `es` or `fr` after `https://stargazers.club/` will be treated as default locale, i.e. `en`
			locales: {
				es: 'es-ES',
				en: 'en-US',
				pt: 'pt-PT',
				gl: 'gl-ES',
			},
		},
	}), robotsTxt(robotsConfig), tailwind()],
	i18n: {
		defaultLocale: "es",
		locales: ["es", "en", "pt", "gl"],
	},
	server: {
		port: 3000
	},
	vite: {
		css: {
			postcss: {
				plugins: [tailwindcssNesting()]
			}
		}
	}
});
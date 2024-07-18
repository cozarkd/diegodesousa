import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import tailwind from "@astrojs/tailwind";
import tailwindcssNesting from 'tailwindcss/nesting'


// https://astro.build/config
export default defineConfig({
	site: 'https://diegodesousa.com',
	integrations: [mdx(), sitemap(), tailwind()],
	i18n: {
		defaultLocale: "es",
		locales: ["es", "en", "pt"],
	},
	server: { port: 3000 },
	vite: {
		css: {
			postcss: {
				plugins: [
					tailwindcssNesting(),
				],
			},
		},
	},
});

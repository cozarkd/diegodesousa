import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import eslintPluginAstro from 'eslint-plugin-astro';
import importPlugin from 'eslint-plugin-import';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import nPlugin from 'eslint-plugin-n';
import promisePlugin from 'eslint-plugin-promise';

export default [
	// Global ignores - applied to all files
	{
		ignores: [
			'**/node_modules/**',
			'**/dist/**',
			'**/.astro/**',
			'**/coverage/**',
			'**/.*' // Ignore dotfiles like .editorconfig
		]
	},

	// TypeScript/JavaScript files
	{
		files: ['**/*.{js,mjs,cjs,ts,tsx}'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module'
			}
		},
		plugins: {
			'@typescript-eslint': tsPlugin,
			import: importPlugin,
			n: nPlugin,
			promise: promisePlugin
		},
		rules: {
			...tsPlugin.configs.recommended.rules,
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ argsIgnorePattern: '^_' }
			]
		}
	},

	// Astro files - use plugin's flat config exports
	...eslintPluginAstro.configs.recommended,
	...eslintPluginAstro.configs['jsx-a11y-recommended'],

	// JSX accessibility for React TSX files
	{
		files: ['**/*.{jsx,tsx}'],
		plugins: {
			'jsx-a11y': jsxA11yPlugin
		},
		rules: {
			...jsxA11yPlugin.configs.recommended.rules
		}
	}
];

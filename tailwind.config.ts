import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				primary: {
					50: '#f0f7ff',
					100: '#e0eeff',
					200: '#baddff',
					300: '#84c5ff',
					400: '#44a6ff',
					500: '#1a85ff',
					600: '#0066ff',
					700: '#0052d6',
					800: '#0042ab',
					900: '#003c8c',
				},
				neutral: {
					50: '#f8fafc',
					100: '#f1f5f9',
					200: '#e2e8f0',
					300: '#cbd5e1',
					400: '#94a3b8',
					500: '#64748b',
					600: '#475569',
					700: '#334155',
					800: '#1e293b',
					900: '#0f172a',
				}
			}
		}
	},

	plugins: [typography, forms, containerQueries]
} satisfies Config;

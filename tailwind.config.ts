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
					50: '#f9fafb',
					100: '#f3f4f6',
					200: '#e5e7eb',
					300: '#d1d5db',
					400: '#9ca3af',
					500: '#6b7280',
					600: '#4b5563',
					700: '#374151',
					800: '#1f2937',
					900: '#111827',
				}
			}
		}
	},

	plugins: [typography, forms, containerQueries]
} satisfies Config;

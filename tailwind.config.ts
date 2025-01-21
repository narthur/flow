import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			boxShadow: {
				inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
			},
			colors: {
				primary: {
					50: '#eef9ff',
					100: '#dff3ff',
					200: '#b8e8ff',
					300: '#78d6ff',
					400: '#3ac0ff',
					500: '#06a4ff',
					600: '#0085ff',
					700: '#0069cc',
					800: '#0058a6',
					900: '#004c8c',
					950: '#003156',
				},
				secondary: {
					50: '#f1fff8',
					100: '#dcfff0',
					200: '#b1ffdc',
					300: '#6dffc0',
					400: '#24ff9c',
					500: '#00eb7f',
					600: '#00c567',
					700: '#009852',
					800: '#007844',
					900: '#00623a',
					950: '#003720',
				},
				danger: {
					50: '#fff1f1',
					100: '#ffe1e1',
					200: '#ffc7c7',
					300: '#ff9d9d',
					400: '#ff6464',
					500: '#ff3838',
					600: '#ff1414',
					700: '#e60000',
					800: '#c00000',
					900: '#9d0000',
					950: '#560000',
				},
				warning: {
					50: '#fff8eb',
					100: '#ffecc7',
					200: '#ffd988',
					300: '#ffc14e',
					400: '#ffa524',
					500: '#ff8800',
					600: '#cc6a00',
					700: '#a35400',
					800: '#854400',
					900: '#663300',
					950: '#331a00',
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
					950: '#030712',
				}
			}
		}
	},

	plugins: [typography, forms, containerQueries]
} satisfies Config;

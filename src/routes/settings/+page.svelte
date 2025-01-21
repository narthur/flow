<script lang="ts">
	import { settings } from '$lib/stores/settings';
	import Button from '$lib/components/Button.svelte';

	// Watch system dark mode preference
	const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
	let isDarkMode = $derived(
		$settings.theme === 'dark' || ($settings.theme === 'system' && systemDarkMode.matches)
	);

	// Apply dark mode class to html element and add transition
	$effect(() => {
		document.documentElement.classList.add('transition-colors');
		document.documentElement.classList.toggle('dark', isDarkMode);
		setTimeout(() => {
			document.documentElement.classList.remove('transition-colors');
		}, 1000);
	});
</script>

<div class="mx-auto max-w-2xl p-6 pt-12">
	<header class="mb-8">
		<h1 class="text-2xl font-bold text-neutral-800 dark:text-neutral-100">Settings</h1>
	</header>

	<div class="space-y-6">
		<div
			class="flex items-center justify-between rounded-lg bg-white p-4 shadow-md dark:bg-neutral-800"
		>
			<div>
				<h2 class="font-medium text-neutral-800 dark:text-neutral-100">Timer Sound</h2>
				<p class="text-sm text-neutral-600 dark:text-neutral-400">Play a sound when timer ends</p>
			</div>
			<label class="relative inline-flex cursor-pointer items-center">
				<input
					type="checkbox"
					class="peer sr-only"
					checked={$settings.timerSound}
					oninput={() => settings.toggleTimerSound()}
				/>
				<div
					class="peer h-6 w-11 rounded-full bg-neutral-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-600 peer-checked:after:translate-x-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 dark:bg-neutral-700"
				></div>
			</label>
		</div>

		<div class="rounded-lg bg-white p-4 shadow-md dark:bg-neutral-800">
			<div class="mb-4">
				<h2 class="font-medium text-neutral-800 dark:text-neutral-100">Theme</h2>
				<p class="text-sm text-neutral-600 dark:text-neutral-400">
					Choose your preferred color theme
				</p>
			</div>
			<div class="flex gap-2">
				<Button
					variant={$settings.theme === 'light' ? 'primary' : 'tertiary'}
					on:click={() => settings.setTheme('light')}
				>
					Light
				</Button>
				<Button
					variant={$settings.theme === 'dark' ? 'primary' : 'tertiary'}
					on:click={() => settings.setTheme('dark')}
				>
					Dark
				</Button>
				<Button
					variant={$settings.theme === 'system' ? 'primary' : 'tertiary'}
					on:click={() => settings.setTheme('system')}
				>
					System
				</Button>
			</div>
		</div>
	</div>
</div>

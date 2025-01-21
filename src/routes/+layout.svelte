<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	let { children } = $props();

	const navItems = [
		{ href: '/', label: 'Timer' },
		{ href: '/tasks', label: 'Tasks' },
		{ href: '/settings', label: 'Settings' }
	];

	const currentPath = $derived($page.url.pathname);
</script>

<div class="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
	<nav class="border-b border-neutral-200 bg-white">
		<div class="mx-auto max-w-2xl px-6">
			<div class="flex h-14 items-center gap-6">
				<span class="text-lg font-bold text-neutral-800">Flow</span>
				<span class="text-neutral-300">|</span>
				{#each navItems as item}
					<a
						href={item.href}
						class="text-sm font-medium transition-colors duration-200 {currentPath === item.href
							? 'text-primary-600'
							: 'text-neutral-600 hover:text-neutral-800'}"
					>
						{item.label}
					</a>
				{/each}
			</div>
		</div>
	</nav>

	{@render children()}
</div>

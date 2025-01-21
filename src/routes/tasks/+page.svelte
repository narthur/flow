<script lang="ts">
	import { tasks } from '$lib/stores/tasks';
	import Button from '$lib/components/Button.svelte';

	function formatDate(date: Date | undefined): string {
		if (!date) return 'Not postponed';
		return new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric'
		}).format(date);
	}
</script>

<div class="mx-auto max-w-2xl p-6 pt-12">
	<header class="mb-8 flex items-center justify-between">
		<h1 class="text-2xl font-bold text-neutral-800">All Tasks</h1>
		<nav>
			<a href="/" class="inline-block">
				<Button>Back to Timer</Button>
			</a>
		</nav>
	</header>

	<div class="space-y-4">
		{#each $tasks as task}
			<div class="rounded-lg bg-white p-4 shadow-md">
				<h2 class="text-lg font-semibold text-neutral-800">{task.title}</h2>
				{#if task.notes}
					<p class="mt-2 text-neutral-600">{task.notes}</p>
				{/if}
				<div class="mt-2 text-sm text-neutral-500">
					Postponed until: {formatDate(task.postponedUntil)}
				</div>
			</div>
		{:else}
			<div class="text-center text-neutral-600">
				<p>No tasks available</p>
			</div>
		{/each}
	</div>
</div>

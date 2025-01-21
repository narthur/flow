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
		<div class="flex items-center gap-4">
			<h1 class="text-2xl font-bold text-neutral-800">All Tasks</h1>
			<div class="flex gap-2">
				<button
					class="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors duration-200"
					on:click={() => {
						const text = $tasks
							.map(task => task.title)
							.join('\n');
						navigator.clipboard.writeText(text)
							.then(() => alert('Tasks copied to clipboard!'))
							.catch(() => alert('Failed to copy tasks'));
					}}
				>
					Export
				</button>
				<span class="text-neutral-300">|</span>
				<button
					class="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors duration-200"
					on:click={() => {
						const text = prompt('Paste your tasks (one per line):');
						if (text) {
							const count = tasks.importTasks(text);
							alert(`Imported ${count} tasks`);
						}
					}}
				>
					Import
				</button>
			</div>
		</div>
		<nav>
			<a href="/" class="inline-block">
				<Button>Back to Timer</Button>
			</a>
		</nav>
	</header>

	<div class="space-y-4">
		{#each $tasks as task}
			<div class="rounded-lg bg-white p-4 shadow-md">
				<div class="flex items-start justify-between">
					<div>
						<h2 class="text-lg font-semibold text-neutral-800">{task.title}</h2>
						{#if task.notes}
							<p class="mt-2 text-neutral-600">{task.notes}</p>
						{/if}
					</div>
					<div class="text-sm font-medium">
						{#if task.stats.status === 'postponed'}
							<span class="rounded-full bg-primary-50 px-2 py-1 text-primary-700">Postponed</span>
						{:else if task.stats.status === 'completed'}
							<span class="rounded-full bg-neutral-100 px-2 py-1 text-neutral-700">Completed</span>
						{:else}
							<span class="rounded-full bg-neutral-100 px-2 py-1 text-neutral-700">Active</span>
						{/if}
					</div>
				</div>

				<div class="mt-4 flex items-center justify-between">
					<div class="flex gap-6 text-sm text-neutral-600">
						<div>
							<span class="font-medium">{task.stats.sessionCount}</span> sessions
						</div>
						<div>
							<span class="font-medium">{(task.stats.totalMinutes).toFixed(1)}</span> minutes
						</div>
						<div>
							<span class="font-medium">{task.stats.postponeCount}</span> postponements
						</div>
					</div>

					<button
						class="text-neutral-400 hover:text-neutral-600 transition-colors duration-200"
						on:click={() => {
							if (confirm('Are you sure you want to delete this task?')) {
								tasks.deleteTask(task.id);
							}
						}}
						title="Delete task"
						aria-label="Delete task"
					>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
							<path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
						</svg>
					</button>
				</div>

				{#if task.postponedUntil}
					<div class="mt-2 text-sm text-neutral-500">
						Next available: {formatDate(task.postponedUntil)}
					</div>
				{/if}
			</div>
		{:else}
			<div class="text-center text-neutral-600">
				<p>No tasks available</p>
			</div>
		{/each}
	</div>
</div>

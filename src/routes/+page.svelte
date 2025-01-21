<script lang="ts">
	import chime from '$lib/chime';
	import { tasks, type Task } from '$lib/stores/tasks';

	const timeOptions = [
		{ label: '10 sec', minutes: 0.16666666666666666 },
		{ label: '1 min', minutes: 1 },
		{ label: '5 min', minutes: 5 },
		{ label: '15 min', minutes: 15 },
		{ label: '30 min', minutes: 30 },
		{ label: '1 hour', minutes: 60 }
	];

	let currentTask: Task | null = null;
	let postponeInput = '';
	let postponeError = '';
	let activeTimer: number | null = null;
	let remainingSeconds = 0;
	let timerInterval: ReturnType<typeof setInterval> | null = null;

	// Get the first non-postponed task
	$: {
		currentTask =
			$tasks.find((task) => {
				if (!task.postponedUntil) return true;
				return new Date() >= task.postponedUntil;
			}) || null;
	}

	function startTimer(minutes: number) {
		// Clear any existing timer
		if (timerInterval) {
			clearInterval(timerInterval);
		}

		remainingSeconds = minutes * 60;
		activeTimer = minutes;

		timerInterval = setInterval(() => {
			remainingSeconds--;
			if (remainingSeconds <= 0) {
				if (timerInterval) clearInterval(timerInterval);
				timerInterval = null;
				activeTimer = null;
				chime();
			}
		}, 1000);
	}

	function formatTime(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	function handlePostpone() {
		if (!currentTask) return;

		const success = tasks.postpone(currentTask.id, postponeInput);
		if (!success) {
			postponeError = 'Could not understand that date/time';
			return;
		}

		postponeError = '';
		postponeInput = '';
	}

	function handlePunt() {
		if (!currentTask) return;
		tasks.punt(currentTask.id);
	}
</script>

<div class="relative mx-auto max-w-2xl p-6">
	{#if currentTask}
		<div class="mb-6 rounded-lg bg-white p-6 shadow-lg">
			<input
				type="text"
				class="mb-4 w-full rounded bg-transparent px-1 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
				value={currentTask.title}
				on:input={(e) => tasks.updateTitle(currentTask.id, e.currentTarget.value)}
			/>
			{#if currentTask.description}
				<p class="mb-6 text-gray-600">{currentTask.description}</p>
			{/if}

			<div class="mb-6">
				<label for="notes" class="mb-2 block text-sm font-medium text-gray-700">Notes</label>
				<textarea
					id="notes"
					rows="3"
					class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
					placeholder="Add notes about this task..."
					value={currentTask.notes ?? ''}
					on:input={(e) => tasks.updateNotes(currentTask.id, e.currentTarget.value)}
				/>
			</div>

			<div class="space-y-4">
				{#if activeTimer}
					<div class="py-4 text-center">
						<div class="font-mono text-4xl font-bold text-blue-600">
							{formatTime(remainingSeconds)}
						</div>
						<div class="mt-2 text-gray-500">
							Working for {activeTimer} minutes
						</div>
					</div>
				{:else}
					<div class="flex flex-wrap gap-2">
						{#each timeOptions as option}
							<button
								class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
								on:click={() => startTimer(option.minutes)}
							>
								{option.label}
							</button>
						{/each}
					</div>
				{/if}

				<div class="flex gap-2">
					<input
						type="text"
						bind:value={postponeInput}
						placeholder="e.g. tomorrow at 2pm"
						class="flex-1 rounded border px-3 py-2"
					/>
					<button
						class="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
						on:click={handlePostpone}
					>
						Postpone
					</button>
				</div>
				{#if postponeError}
					<p class="text-sm text-red-500">{postponeError}</p>
				{/if}

				<button
					class="w-full rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
					on:click={handlePunt}
				>
					Skip for now
				</button>
			</div>
		</div>
	{:else}
		<div class="py-12 text-center">
			<h2 class="text-2xl font-bold text-gray-700">No tasks available right now</h2>
			<p class="mt-2 text-gray-500">All tasks are either completed or postponed</p>
		</div>
	{/if}

	<!-- Floating Action Button -->
	<button
		class="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600"
		aria-label="Add new task"
		on:click={() => {
			const title = prompt('What task would you like to add?');
			if (title) {
				const id = tasks.addTask(title);
				console.log('Added new task with id:', id);
			}
		}}
		title="Add new task"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
		</svg>
	</button>
</div>

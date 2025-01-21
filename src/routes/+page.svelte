<script lang="ts">
	import chime from '$lib/chime';
	import { tasks, type Task } from '$lib/stores/tasks';
	import Button from '$lib/components/Button.svelte';

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
	let showAddTaskModal = false;
	let newTaskInput = '';

	function handleAddTasks() {
		if (newTaskInput.trim()) {
			const count = tasks.importTasks(newTaskInput);
			if (count === 1) {
				console.log('Added 1 task');
			} else {
				console.log(`Added ${count} tasks`);
			}
		}
		showAddTaskModal = false;
		newTaskInput = '';
	}

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

<div class="relative mx-auto max-w-2xl p-6 pt-12">
	<header class="mb-8 flex items-center justify-between">
		<h1 class="text-2xl font-bold text-neutral-800">Flow</h1>
		<nav>
			<a
				href="/tasks"
				class="rounded border border-neutral-300 bg-white px-4 py-2 text-neutral-700 transition-colors duration-200 hover:bg-neutral-50"
			>
				View All Tasks
			</a>
		</nav>
	</header>
	{#if currentTask}
		<div
			class="mb-6 rounded-lg bg-white p-6 shadow-md transition-shadow duration-200 hover:shadow-lg"
		>
			<input
				type="text"
				class="focus:ring-primary-500 mb-4 w-full rounded bg-transparent px-3 py-2 text-2xl font-bold transition-colors duration-200 focus:outline-none focus:ring-2"
				value={currentTask?.title ?? ''}
				on:input={(e) => currentTask && tasks.updateTitle(currentTask.id, e.currentTarget.value)}
			/>
			{#if currentTask.description}
				<p class="mb-6 text-gray-600">{currentTask.description}</p>
			{/if}

			<div class="mb-6">
				<label for="notes" class="mb-2 block text-sm font-medium text-gray-700">Notes</label>
				<textarea
					id="notes"
					rows="3"
					class="focus:border-primary-500 focus:ring-primary-500 w-full resize-none rounded-lg border-neutral-200 bg-white px-4 py-3 transition-colors duration-200 focus:ring-2"
					placeholder="Add notes about this task..."
					value={currentTask?.notes ?? ''}
					on:input={(e) => currentTask && tasks.updateNotes(currentTask.id, e.currentTarget.value)}
				></textarea>
			</div>

			<div class="space-y-4">
				{#if activeTimer}
					<div class="py-4 text-center">
						<div
							class="text-primary-600 font-mono text-4xl font-bold transition-colors duration-200"
						>
							{formatTime(remainingSeconds)}
						</div>
						<div class="mt-2 text-gray-500">
							Working for {activeTimer} minutes
						</div>
						<div class="mt-4 flex justify-center gap-2">
							{#if timerInterval}
								<Button
									on:click={() => {
										if (timerInterval) {
											clearInterval(timerInterval);
											timerInterval = null;
										}
									}}
								>
									Pause
								</Button>
							{:else}
								<Button
									variant="secondary"
									on:click={() => {
										timerInterval = setInterval(() => {
											remainingSeconds--;
											if (remainingSeconds <= 0) {
												if (timerInterval) clearInterval(timerInterval);
												timerInterval = null;
												activeTimer = null;
												chime();
											}
										}, 1000);
									}}
								>
									Resume
								</Button>
							{/if}
							<Button
								variant="secondary"
								on:click={() => {
									remainingSeconds = (activeTimer ?? 0) * 60;
									if (timerInterval) {
										clearInterval(timerInterval);
										timerInterval = null;
									}
								}}
							>
								Reset
							</Button>
							<button
								class="rounded bg-neutral-100 px-4 py-2 text-neutral-700 hover:bg-neutral-200"
								on:click={() => {
									if (timerInterval) {
										clearInterval(timerInterval);
										timerInterval = null;
									}
									activeTimer = null;
									remainingSeconds = 0;
								}}
							>
								Cancel
							</button>
						</div>
					</div>
				{:else}
					<div class="flex flex-wrap gap-2">
						{#each timeOptions as option}
							<Button
								variant="secondary"
								on:click={() => startTimer(option.minutes)}
							>
								{option.label}
							</Button>
						{/each}
					</div>
				{/if}

				<div class="flex gap-2">
					<input
						type="text"
						bind:value={postponeInput}
						placeholder="e.g. tomorrow at 2pm"
						class="focus:border-primary-500 focus:ring-primary-500 flex-1 rounded border-neutral-200 px-4 py-2 transition-colors duration-200 focus:ring-2"
					/>
					<Button
						variant="secondary"
						on:click={handlePostpone}
					>
						Postpone
					</Button>
				</div>
				{#if postponeError}
					<p class="text-sm text-red-500">{postponeError}</p>
				{/if}

				<div class="flex gap-2">
					<button
						class="flex-1 rounded border border-neutral-300 bg-white px-4 py-2 text-neutral-700 transition-colors duration-200 hover:bg-neutral-50"
						on:click={() => {
							if (confirm('Are you sure you want to delete this task?') && currentTask) {
								tasks.deleteTask(currentTask.id);
							}
						}}
					>
						Delete
					</button>
					<Button
						variant="primary"
						flex
						on:click={() => currentTask && tasks.completeTask(currentTask.id)}
					>
						Complete
					</Button>
				</div>

				<Button fullWidth on:click={handlePunt}>Skip for now</Button>
			</div>
		</div>
	{:else}
		<div class="py-12 text-center">
			<h2 class="text-2xl font-bold text-gray-700">No tasks available right now</h2>
			<p class="mt-2 text-gray-500">All tasks are either completed or postponed</p>
		</div>
	{/if}

	<!-- Add Task Button -->
	<button
		class="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full border border-primary-600 bg-primary-500 font-medium text-white shadow-md transition-all duration-200 hover:bg-primary-600 hover:shadow-lg"
		aria-label="Add tasks"
		on:click={() => (showAddTaskModal = true)}
		title="Add tasks"
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

	<!-- Add Task Modal -->
	{#if showAddTaskModal}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
				<h2 class="mb-4 text-xl font-bold">Add Tasks</h2>
				<p class="mb-2 text-sm text-gray-600">Enter one task per line</p>
				<textarea
					class="focus:border-primary-500 focus:ring-primary-500 mb-4 h-32 w-full rounded-lg border border-neutral-200 bg-white p-4 shadow-inner transition-all duration-200 hover:border-neutral-300 focus:ring-2"
					placeholder="Buy groceries&#10;Call dentist&#10;Write report"
					bind:value={newTaskInput}
					on:keydown={(e) => {
						if (e.key === 'Enter' && e.ctrlKey) {
							handleAddTasks();
						}
					}}
				></textarea>
				<div class="flex justify-end gap-2">
					<button
						class="rounded-lg border border-neutral-300 bg-gradient-to-b from-neutral-100 to-neutral-200 px-4 py-2 shadow-sm transition-all duration-200 hover:from-neutral-200 hover:to-neutral-300 active:translate-y-0.5 active:shadow-none"
						on:click={() => {
							showAddTaskModal = false;
							newTaskInput = '';
						}}
					>
						Cancel
					</button>
					<button
						class="border-primary-600 from-primary-400 to-primary-500 hover:from-primary-500 hover:to-primary-600 rounded-lg border bg-gradient-to-b px-4 py-2 text-white shadow-sm transition-all duration-200 active:translate-y-0.5 active:shadow-none"
						on:click={handleAddTasks}
					>
						Add Tasks
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>

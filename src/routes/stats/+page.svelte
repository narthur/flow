<script lang="ts">
	import { stats } from '$lib/stores/stats';
	import Chart from '$lib/components/Chart.svelte';
</script>

<div class="mx-auto max-w-2xl p-6 pt-12">
	<header class="mb-8">
		<h1 class="text-2xl font-bold text-neutral-800 dark:text-neutral-100">Productivity Stats</h1>
	</header>

	<div class="grid gap-6 md:grid-cols-2">
		<div class="rounded-lg bg-white p-4 shadow-md dark:bg-neutral-800">
			<h2 class="mb-4 text-lg font-semibold">Daily Sessions</h2>
			<div class="text-3xl font-bold text-primary-600">
				{$stats.dailySessions}
			</div>
		</div>

		<div class="rounded-lg bg-white p-4 shadow-md dark:bg-neutral-800">
			<h2 class="mb-4 text-lg font-semibold">Weekly Total</h2>
			<div class="text-3xl font-bold text-primary-600">
				{$stats.weeklyTotal}m
			</div>
		</div>

		<div class="col-span-full rounded-lg bg-white p-4 shadow-md dark:bg-neutral-800">
			<h2 class="mb-4 text-lg font-semibold">Productivity Trend</h2>
			<Chart data={$stats.productivityTrend} />
		</div>
	</div>
</div>

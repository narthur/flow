import { writable } from 'svelte/store';
import { tasks } from './tasks';
import type { Task } from './tasks';

interface Stats {
	dailySessions: number;
	weeklyTotal: number;
	productivityTrend: number[];
}

function createStatsStore() {
	const { subscribe, update } = writable<Stats>({
		dailySessions: 0,
		weeklyTotal: 0,
		productivityTrend: []
	});

	// Update stats when tasks change
	tasks.subscribe(updateStats);

	function updateStats(tasks: Task[]) {
		update((stats) => ({
			...stats,
			dailySessions: calculateDailySessions(tasks),
			weeklyTotal: calculateWeeklyTotal(tasks),
			productivityTrend: calculateProductivityTrend(tasks)
		}));
	}    function calculateDailySessions(tasks: Task[]): number {
        return tasks.reduce((count, task) => count + task.stats.sessionCount, 0);
    }

    function calculateWeeklyTotal(tasks: Task[]): number {
        return tasks.reduce((total, task) => total + task.stats.totalMinutes, 0);
    }

    function calculateProductivityTrend(tasks: Task[]): number[] {
        return tasks.map(task => task.stats.totalMinutes);
    }

	return { subscribe };
}

export const stats = createStatsStore();

import { writable } from 'svelte/store';
import * as chrono from 'chrono-node';

export interface Task {
	id: string;
	title: string;
	description?: string;
	postponedUntil?: Date;
	notes?: string;
	stats: {
		sessionCount: number;
		totalMinutes: number;
		postponeCount: number;
		status: 'active' | 'postponed' | 'completed';
	};
}

function createTaskStore() {
	// Load initial tasks from localStorage or use defaults
	const storedTasks = localStorage.getItem('tasks');
	const initialTasks: Task[] = storedTasks
		? JSON.parse(storedTasks)
		: [
				{
					id: '1',
					title: 'Learn Svelte',
					stats: {
						sessionCount: 0,
						totalMinutes: 0,
						postponeCount: 0,
						status: 'active'
					}
				},
				{
					id: '2',
					title: 'Build a task manager',
					stats: {
						sessionCount: 0,
						totalMinutes: 0,
						postponeCount: 0,
						status: 'active'
					}
				},
				{
					id: '3',
					title: 'Write documentation',
					stats: {
						sessionCount: 0,
						totalMinutes: 0,
						postponeCount: 0,
						status: 'active'
					}
				}
			];

	// Convert ISO date strings back to Date objects
	initialTasks.forEach((task) => {
		if (task.postponedUntil) {
			task.postponedUntil = new Date(task.postponedUntil);
		}
	});

	const { subscribe, update } = writable<Task[]>(initialTasks);

	// Subscribe to changes and save to localStorage
	subscribe((tasks) => {
		localStorage.setItem('tasks', JSON.stringify(tasks));
	});

	return {
		subscribe,
		postpone: (taskId: string, naturalDateText: string) => {
			const parsedDate = chrono.parseDate(naturalDateText, new Date(), { forwardDate: true });
			if (!parsedDate) return false;

			update((tasks) =>
				tasks.map((task) =>
					task.id === taskId
						? {
								...task,
								postponedUntil: parsedDate,
								stats: {
									...task.stats,
									postponeCount: task.stats.postponeCount + 1,
									status: 'postponed' as const
								}
							}
						: task
				)
			);
			return true;
		},
		recordSession: (taskId: string, minutes: number) => {
			if (minutes <= 0) return;

			update((tasks) =>
				tasks.map((task) =>
					task.id === taskId
						? {
								...task,
								stats: {
									...task.stats,
									sessionCount: task.stats.sessionCount + 1,
									totalMinutes: task.stats.totalMinutes + minutes
								}
							}
						: task
				)
			);
		},

		punt: (taskId: string, sessionMinutes: number = 0) => {
			update((tasks) => {
				const task = tasks.find((t) => t.id === taskId);
				if (!task) return tasks;
				return [
					...tasks.filter((t) => t.id !== taskId),
					{
						...task,
						stats: {
							...task.stats,
							status: 'active',
							sessionCount:
								sessionMinutes > 0 ? task.stats.sessionCount + 1 : task.stats.sessionCount,
							totalMinutes: task.stats.totalMinutes + sessionMinutes
						}
					}
				];
			});
		},
		updateNotes: (taskId: string, notes: string) => {
			update((tasks) => tasks.map((task) => (task.id === taskId ? { ...task, notes } : task)));
		},
		updateTitle: (taskId: string, title: string) => {
			update((tasks) => tasks.map((task) => (task.id === taskId ? { ...task, title } : task)));
		},
		addTask: (title: string = 'New Task') => {
			const id = crypto.randomUUID();
			update((tasks) => [
				...tasks,
				{
					id,
					title,
					stats: {
						sessionCount: 0,
						totalMinutes: 0,
						postponeCount: 0,
						status: 'active'
					}
				}
			]);
			return id;
		},
		deleteTask: (taskId: string) => {
			update((tasks) => tasks.filter((task) => task.id !== taskId));
		},
		completeTask: (taskId: string) => {
			update((tasks) =>
				tasks.map((task) =>
					task.id === taskId
						? {
								...task,
								stats: {
									...task.stats,
									status: 'completed' as const
								}
							}
						: task
				)
			);
		},
		importTasks: (text: string) => {
			const newTasks = text
				.split('\n')
				.map((line) => line.trim())
				.filter((line) => line.length > 0)
				.map((title) => ({
					id: crypto.randomUUID(),
					title,
					stats: {
						sessionCount: 0,
						totalMinutes: 0,
						postponeCount: 0,
						status: 'active' as const
					}
				}));

			update((tasks) => [...tasks, ...newTasks]);
			return newTasks.length;
		}
	};
}

export const tasks = createTaskStore();

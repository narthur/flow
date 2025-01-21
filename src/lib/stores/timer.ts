import { writable } from 'svelte/store';

interface TimerState {
	activeTimer: number | null;
	remainingSeconds: number;
	isRunning: boolean;
}

function createTimerStore() {
	const { subscribe, set, update } = writable<TimerState>({
		activeTimer: null,
		remainingSeconds: 0,
		isRunning: false
	});

	return {
		subscribe,
		start: (minutes: number) => {
			console.log(`Starting timer for ${minutes} minutes`);
			update((state) => ({
				...state,
				activeTimer: minutes,
				remainingSeconds: minutes * 60,
				isRunning: true
			}));
		},
		pause: () => {
			update((state) => ({
				...state,
				isRunning: false
			}));
		},
		resume: () => {
			update((state) => ({
				...state,
				isRunning: true
			}));
		},
		reset: () => {
			update((state) => ({
				...state,
				remainingSeconds: (state.activeTimer ?? 0) * 60,
				isRunning: false
			}));
		},
		tick: () => {
			update((state) => ({
				...state,
				remainingSeconds: state.remainingSeconds - 1
			}));
		},
		clear: () => {
			console.log('Clearing timer');
			set({
				activeTimer: null,
				remainingSeconds: 0,
				isRunning: false
			});
		}
	};
}

export const timer = createTimerStore();

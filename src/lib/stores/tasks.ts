import { writable } from 'svelte/store';
import * as chrono from 'chrono-node';

export interface Task {
    id: string;
    title: string;
    description?: string;
    postponedUntil?: Date;
}

function createTaskStore() {
    // Example tasks - in a real app these would come from a backend
    const initialTasks: Task[] = [
        { id: '1', title: 'Learn Svelte' },
        { id: '2', title: 'Build a task manager' },
        { id: '3', title: 'Write documentation' }
    ];

    const { subscribe, set, update } = writable<Task[]>(initialTasks);

    return {
        subscribe,
        postpone: (taskId: string, naturalDateText: string) => {
            const parsedDate = chrono.parseDate(naturalDateText, new Date(), { forwardDate: true });
            if (!parsedDate) return false;

            update(tasks => tasks.map(task => 
                task.id === taskId 
                    ? { ...task, postponedUntil: parsedDate }
                    : task
            ));
            return true;
        },
        punt: (taskId: string) => {
            update(tasks => {
                const task = tasks.find(t => t.id === taskId);
                if (!task) return tasks;
                return [...tasks.filter(t => t.id !== taskId), { ...task }];
            });
        }
    };
}

export const tasks = createTaskStore();

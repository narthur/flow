import { writable } from 'svelte/store';
import * as chrono from 'chrono-node';

export interface Task {
    id: string;
    title: string;
    description?: string;
    postponedUntil?: Date;
    notes?: string;
}

function createTaskStore() {
    // Load initial tasks from localStorage or use defaults
    const storedTasks = localStorage.getItem('tasks');
    const initialTasks: Task[] = storedTasks ? JSON.parse(storedTasks) : [
        { id: '1', title: 'Learn Svelte' },
        { id: '2', title: 'Build a task manager' },
        { id: '3', title: 'Write documentation' }
    ];

    // Convert ISO date strings back to Date objects
    initialTasks.forEach(task => {
        if (task.postponedUntil) {
            task.postponedUntil = new Date(task.postponedUntil);
        }
    });

    const { subscribe, set, update } = writable<Task[]>(initialTasks);

    // Subscribe to changes and save to localStorage
    subscribe(tasks => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    });

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
        },
        updateNotes: (taskId: string, notes: string) => {
            update(tasks => tasks.map(task =>
                task.id === taskId
                    ? { ...task, notes }
                    : task
            ));
        },
        updateTitle: (taskId: string, title: string) => {
            update(tasks => tasks.map(task =>
                task.id === taskId
                    ? { ...task, title }
                    : task
            ));
        },
        addTask: (title: string = 'New Task') => {
            const id = crypto.randomUUID();
            update(tasks => [...tasks, { id, title }]);
            return id;
        },
        deleteTask: (taskId: string) => {
            update(tasks => tasks.filter(task => task.id !== taskId));
        },
        completeTask: (taskId: string) => {
            update(tasks => tasks.filter(task => task.id !== taskId));
        }
    };
}

export const tasks = createTaskStore();

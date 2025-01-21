import { writable } from 'svelte/store';

interface Settings {
    timerSound: boolean;
    theme: 'light' | 'dark' | 'system';
}

function createSettingsStore() {
    const storedSettings = localStorage.getItem('settings');
    const initialSettings: Settings = storedSettings 
        ? JSON.parse(storedSettings)
        : { 
            timerSound: true,
            theme: 'system'
        };

    const { subscribe, set, update } = writable<Settings>(initialSettings);

    // Save to localStorage on changes
    subscribe(settings => {
        localStorage.setItem('settings', JSON.stringify(settings));
    });

    return {
        subscribe,
        toggleTimerSound: () => {
            console.log('Toggling timer sound');
            update(settings => ({ 
                ...settings, 
                timerSound: !settings.timerSound 
            }));
        },
        setTheme: (theme: Settings['theme']) => update(settings => ({
            ...settings,
            theme
        }))
    };
}

export const settings = createSettingsStore();

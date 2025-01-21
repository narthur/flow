import { writable } from 'svelte/store';

interface Settings {
    timerSound: boolean;
}

function createSettingsStore() {
    const storedSettings = localStorage.getItem('settings');
    const initialSettings: Settings = storedSettings 
        ? JSON.parse(storedSettings)
        : { timerSound: true };

    const { subscribe, set, update } = writable<Settings>(initialSettings);

    // Save to localStorage on changes
    subscribe(settings => {
        localStorage.setItem('settings', JSON.stringify(settings));
    });

    return {
        subscribe,
        toggleTimerSound: () => update(settings => ({ 
            ...settings, 
            timerSound: !settings.timerSound 
        }))
    };
}

export const settings = createSettingsStore();

<script lang="ts">
    import { tasks, type Task } from '$lib/stores/tasks';
    import * as chrono from 'chrono-node';

    const timeOptions = [
        { label: '5 min', minutes: 5 },
        { label: '15 min', minutes: 15 },
        { label: '30 min', minutes: 30 },
        { label: '1 hour', minutes: 60 }
    ];

    const BEEP_SOUND = 'data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU' + 
        'tvT18AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
        'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';

    let currentTask: Task | null = null;
    let postponeInput = '';
    let postponeError = '';
    let activeTimer: number | null = null;
    let remainingSeconds = 0;
    let timerInterval: ReturnType<typeof setInterval> | null = null;

    // Get the first non-postponed task
    $: {
        currentTask = $tasks.find(task => {
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
                playChime();
            }
        }, 1000);
    }

    function formatTime(seconds: number): string {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    function playChime() {
        const audio = new Audio();
        audio.src = BEEP_SOUND;
        audio.play();
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

<div class="max-w-2xl mx-auto p-6">
    {#if currentTask}
        <div class="bg-white shadow-lg rounded-lg p-6 mb-6">
            <h2 class="text-2xl font-bold mb-4">{currentTask.title}</h2>
            {#if currentTask.description}
                <p class="text-gray-600 mb-6">{currentTask.description}</p>
            {/if}
            
            <div class="space-y-4">
                {#if activeTimer}
                    <div class="text-center py-4">
                        <div class="text-4xl font-mono font-bold text-blue-600">
                            {formatTime(remainingSeconds)}
                        </div>
                        <div class="text-gray-500 mt-2">
                            Working for {activeTimer} minutes
                        </div>
                    </div>
                {:else}
                    <div class="flex flex-wrap gap-2">
                        {#each timeOptions as option}
                            <button 
                                class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
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
                        class="flex-1 border rounded px-3 py-2"
                    />
                    <button 
                        class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                        on:click={handlePostpone}
                    >
                        Postpone
                    </button>
                </div>
                {#if postponeError}
                    <p class="text-red-500 text-sm">{postponeError}</p>
                {/if}

                <button 
                    class="w-full bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
                    on:click={handlePunt}
                >
                    Skip for now
                </button>
            </div>
        </div>
    {:else}
        <div class="text-center py-12">
            <h2 class="text-2xl font-bold text-gray-700">No tasks available right now</h2>
            <p class="text-gray-500 mt-2">All tasks are either completed or postponed</p>
        </div>
    {/if}
</div>

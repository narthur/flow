<script lang="ts">
    import { settings } from '$lib/stores/settings';
</script>

<div class="mx-auto max-w-2xl p-6 pt-12">
    <header class="mb-8">
        <h1 class="text-2xl font-bold text-neutral-800">Settings</h1>
    </header>

    <div class="space-y-6">
        <div class="flex items-center justify-between rounded-lg bg-white p-4 shadow-md">
            <div>
                <h2 class="font-medium text-neutral-800">Timer Sound</h2>
                <p class="text-sm text-neutral-600">Play a sound when timer ends</p>
            </div>
            <label class="relative inline-flex cursor-pointer items-center">
                <input
                    type="checkbox"
                    class="peer sr-only"
                    checked={$settings.timerSound}
                    on:change={() => settings.toggleTimerSound()}
                />
                <div class="peer h-6 w-11 rounded-full bg-neutral-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-600 peer-checked:after:translate-x-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500"></div>
            </label>
        </div>
    </div>
</div>

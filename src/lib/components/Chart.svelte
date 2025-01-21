<script lang="ts">
    export let data: number[] = [];
</script>

<div class="chart-container">
    <svg width="100%" height="200">
        {#each data as value, index}
            <rect 
                x="{index * 30}" 
                y="{200 - value}" 
                width="25" 
                height="{value}"
                class="fill-primary-500"
            />
        {/each}
    </svg>
</div>

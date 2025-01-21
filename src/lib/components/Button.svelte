<script lang="ts">
	export let variant: 'primary' | 'secondary' | 'tertiary' = 'tertiary';
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let fullWidth = false;
	export let flex = false;
</script>

<button
	{type}
	class="rounded px-4 py-2 transition-colors duration-200 {flex ? 'flex-1' : ''} {fullWidth ? 'w-full' : ''} {variant === 'primary'
		? 'border border-primary-600 bg-primary-500 text-white font-medium hover:bg-primary-600'
		: variant === 'secondary'
		? 'border border-primary-200 bg-primary-50 text-primary-700 hover:bg-primary-100'
		: 'border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'}"
	on:click
>
	<slot />
</button>

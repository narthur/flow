<script lang="ts">
	export let variant: 'primary' | 'secondary' | 'tertiary' = 'tertiary';
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let fullWidth = false;
	export let flex = false;
</script>

<button
	{type}
	class="rounded px-4 py-2 transition-colors duration-200 {flex ? 'flex-1' : ''} {fullWidth ? 'w-full' : ''} {variant === 'primary'
		? 'border border-primary-700 bg-primary-600 text-white font-medium hover:bg-primary-700'
		: variant === 'secondary'
		? 'bg-primary-50 text-primary-700 hover:bg-primary-100'
		: 'border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'}"
	on:click
>
	<slot />
</button>

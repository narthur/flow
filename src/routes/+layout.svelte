<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
	{@render children()}
</div>

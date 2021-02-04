<script lang="ts">
	export let status: number;
	export let error: Error;
	const dev = process.env.NODE_ENV === 'development';
</script>
<style>
</style>
<svelte:head>
	<title>OUPS! {status} - {error.message}</title>
</svelte:head>
<h1>OUPS!</h1>
<p>{status} - {error.message}</p>

{#if dev && error.stack}
	<pre>{error.stack}</pre>
{/if}

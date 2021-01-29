<script lang="ts">
	import Tailwindcss from '../components/Styles/tailwindcss.svelte'
	import WelcomePageView from '../views/MainMenu/WelcomePageView.svelte'
	import ClaimSearchView from '../views/MainMenu/ClaimSearchView.svelte'
	import {claimSearchStore} from '../stores/claimSearchStore'
</script>
<style>
</style>
<Tailwindcss />
<main class="text-center p-1 min-w-screen min-h-screen grid grid-cols-1 items-stretch grid-rows-6 bg-white">
	{#if $claimSearchStore === ''}
		<WelcomePageView/>
	{:else}
		<ClaimSearchView/>
	{/if} 
</main>

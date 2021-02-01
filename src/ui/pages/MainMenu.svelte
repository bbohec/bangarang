<script lang="ts">
	import Tailwindcss from '../components/Styles/tailwindcss.svelte'
	import WelcomePageView from '../views/MainMenu/WelcomePageView.svelte'
	import ClaimSearchView from '../views/MainMenu/ClaimSearchView.svelte'
	import {claimSearchStore} from '../stores/claimSearchStore'
</script>
<style>
</style>
<Tailwindcss />
{#if $claimSearchStore === ''}
	<WelcomePageView/>
{:else}
	<ClaimSearchView/>
{/if} 
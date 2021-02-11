<script lang="ts">
	import WelcomePageView from '../client/views/MainMenu/WelcomePageView.svelte'
	import ClaimSearchView from '../client/views/MainMenu/ClaimSearchView.svelte'
	import {claimSearchStore} from '../client/stores/claimSearchStore'
</script>
<style>
</style>
{#if $claimSearchStore === ''}
	<WelcomePageView/>
{:else}
	<ClaimSearchView/>
{/if} 

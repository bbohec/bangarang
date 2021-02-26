<script lang="ts">
	import MainMenuView from "../client/views/MainMenuView.svelte"
	import SearchClaimsView from '../client/views/SearchClaimsView.svelte'
	import {claimSearchStore} from '../client/stores/claimSearchStore'
</script>
{#if $claimSearchStore === ''}
	<MainMenuView/>
{:else}
	<SearchClaimsView/>
{/if} 
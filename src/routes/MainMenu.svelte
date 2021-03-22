<script lang="ts">
	import MainMenuView from "../client/views/MainMenuView.svelte"
	import SearchClaimsView from '../client/views/SearchClaimsView.svelte'
	import {claimSearchCriteriaStore} from '../client/stores/claimSearchStore'
</script>
{#if $claimSearchCriteriaStore === ''}
	<MainMenuView/>
{:else}
	<SearchClaimsView/>
{/if} 
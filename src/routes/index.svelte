<script lang="ts">
	import Tailwindcss from '../components/unit/Styles/tailwindcss.svelte'
	import WelcomePageView from '../components/views/MainMenu/WelcomePageView.svelte'
	import ClaimSearchView from '../components/views/MainMenu/ClaimSearchView.svelte'
	import {claimSearchStore} from "../components/stores/claimSearchStore"
</script>
<style>
</style>
<Tailwindcss />
{#if $claimSearchStore === ''}
	<WelcomePageView/>
{:else}
	<ClaimSearchView/>
{/if} 
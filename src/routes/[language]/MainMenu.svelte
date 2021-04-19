<script context="module" lang="ts">
	export async function preload(page:any, session:any) {
        const {language} = page.params;
		const selectedLanguage:string = language
		return {selectedLanguage}
	}
</script>
<script lang="ts">
	import MainMenuView from "../../client/views/MainMenuView.svelte"
	import SearchClaimsView from '../../client/views/SearchClaimsView.svelte'
	import {claimSearchCriteriaStore} from '../../client/stores/claimSearchStore'
	import { assignLanguage, redirectOnUnknownLanguage } from "../../client/logic/language";
	import { onMount } from 'svelte';
	export let selectedLanguage:string
	assignLanguage(selectedLanguage)
	onMount(()=>redirectOnUnknownLanguage(selectedLanguage))
</script>
{#if $claimSearchCriteriaStore === ''}
	<MainMenuView/>
{:else}
	<SearchClaimsView/>
{/if} 
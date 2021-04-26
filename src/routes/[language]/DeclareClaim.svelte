<script context="module" lang="ts">
	export async function preload(page:any, session:any) {
        const {language} = page.params;
		const selectedLanguage:string = language
        return {selectedLanguage}
	}
</script>
<script lang="ts">
    import DeclareClaimView from '../../client/views/DeclareClaimView.svelte'
	import { assignLanguage, redirectOnUnknownLanguage } from "../../client/logic/language";
    import { onMount } from "svelte";
	export let selectedLanguage:string
    assignLanguage(selectedLanguage)
	onMount(()=>redirectOnUnknownLanguage(selectedLanguage))
</script>
<DeclareClaimView/>
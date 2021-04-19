<script lang="ts" context="module">
	export async function preload(page:any, session:any) {
        const { valuePropositionPageLink,language } = page.params;
        const selectedLanguage:string = language
        const valuePropositionDesignCanvas:ValuePropositionDesignCanvasContract=retreiveValuePropositionFromValuePropositionPageLink(valuePropositionPageLink)
		return { valuePropositionDesignCanvas,selectedLanguage };
	}
</script>
<script lang="ts">
    import ValuePropositionView from '../../../client/views/ValuePropositionView.svelte'
    import type { ValuePropositionDesignCanvasContract } from "../../../client/interfaces/ValuePropositionCanvasContract";
    import { retreiveValuePropositionFromValuePropositionPageLink } from "../../../client/logic/valueProposition/retreiveValuePropositionFromValuePropositionPageLink";
    import { assignLanguage, redirectOnUnknownLanguage } from '../../../client/logic/language';
    import { onMount } from 'svelte';
    export let valuePropositionDesignCanvas:ValuePropositionDesignCanvasContract
    export let selectedLanguage:string
    assignLanguage(selectedLanguage)
	onMount(()=>redirectOnUnknownLanguage(selectedLanguage))
</script>
<ValuePropositionView valuePropositionDesignCanvas={valuePropositionDesignCanvas}/>
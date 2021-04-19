<script lang="ts" context="module">
	export async function preload(page:any, session:any) {
		const { audience,landingPageId,language } = page.params;
        const valueProposition = retreiveValuePropositionFromValuePropositionPageLink(audience)
        const mainHeadLine:MessageContract|undefined = valueProposition.pains[landingPageId-1]
        const supportingHeadLine:MessageContract|undefined = valueProposition.painRelievers[landingPageId-1]
        const selectedLanguage:string = language
        if (!mainHeadLine || !supportingHeadLine) throw new Error ("Value Proposition not found")
        else return { mainHeadLine,supportingHeadLine,selectedLanguage };
	}
</script>
<script lang="ts">
    import LandingPageView from "../../../../client/views/LandingPageView.svelte"
    import { retreiveValuePropositionFromValuePropositionPageLink } from "../../../../client/logic/valueProposition/retreiveValuePropositionFromValuePropositionPageLink";
    import { assignLanguage, Message, redirectOnUnknownLanguage } from "../../../../client/logic/language";
    import type {  MessageContract } from "../../../../client/logic/language";
    import { languageStore } from "../../../../client/stores/languageStore";
    import { onMount } from "svelte";
    export let mainHeadLine:MessageContract
    export let supportingHeadLine:MessageContract
    export let selectedLanguage:string
    assignLanguage(selectedLanguage)
	onMount(()=>redirectOnUnknownLanguage(selectedLanguage))
</script>
<LandingPageView mainHeadLine={new Message(mainHeadLine).getMessage($languageStore)} supportingHeadLine={new Message(supportingHeadLine).getMessage($languageStore)} />
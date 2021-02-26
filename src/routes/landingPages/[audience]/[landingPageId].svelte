<script lang="ts" context="module">
	export async function preload(page, session) {
		const { audience,landingPageId } = page.params;
        const valueProposition = retreiveValuePropositionFromValuePropositionPageLink(audience)
        const mainHeadLine:string|undefined = valueProposition.pains[landingPageId-1]
        const supportingHeadLine:string|undefined = valueProposition.painRelievers[landingPageId-1]
        if (!mainHeadLine || !supportingHeadLine) throw new Error ("Value Proposition not found")
        else return { mainHeadLine,supportingHeadLine };
	}
</script>
<script lang="ts">
    import LandingPageView from "../../../client/views/LandingPageView.svelte"
    import { retreiveValuePropositionFromValuePropositionPageLink } from "../../../client/logic/valueProposition/retreiveValuePropositionFromValuePropositionPageLink";
    export let mainHeadLine:string
    export let supportingHeadLine:string
</script>
<LandingPageView {mainHeadLine} {supportingHeadLine} />
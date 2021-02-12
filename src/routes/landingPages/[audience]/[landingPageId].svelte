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
    import MainTitle from "../../../client/components/Titles/MainTitle.svelte"
    import MainSubTitle from "../../../client/components/Titles/MainSubTitle.svelte"
    import GenericButton from "../../../client/components/Buttons/GenericButton.svelte"
    import { retreiveValuePropositionFromValuePropositionPageLink } from "../../../client/logic/valueProposition/retreiveValuePropositionFromValuePropositionPageLink";
    import { links } from "../../../client/routing/links";
    export let mainHeadLine:string
    export let supportingHeadLine:string
    const navigateToBangarang = ():void=> {window.location.href = links.MainMenu}
    const theme:"light"|"dark"="dark"
</script>
<main class="flex-grow overflow-y-auto flex flex-col items-center justify-evenly bg-bangarang-dark">
    <section>
        {#if mainHeadLine}
            <MainTitle title={mainHeadLine} size="large" {theme}/>
        {/if}
        {#if supportingHeadLine}
            <MainSubTitle title={`Use Bangarang and ${supportingHeadLine.toLocaleLowerCase()}`} {theme}/>
        {/if}
    </section>
    <GenericButton textbutton="Get started" customClasses="w-11/12" size="large" color="dark" onClickAction={navigateToBangarang}/>
</main>
<script lang="ts" context="module">
	export async function preload(page, session) {
        const { valuePropositionPageLink } = page.params;
        const valuePropositionDesignCanvas:ValuePropositionDesignCanvasContract=retreiveValuePropositionFromValuePropositionPageLink(valuePropositionPageLink)
		return { valuePropositionDesignCanvas };
	}
</script>
<script lang="ts">
    import Link from "../../client/components/Links/Link.svelte"
    import { links } from "../../client/routing/links";
    import HeaderTitle from "../../client/components/Titles/HeaderTitle.svelte"
    import ValuePropositionDesignCanvas from "../../client/components/Lists/ValuePropositionDesignCanvasList.svelte"
    import type { ValuePropositionDesignCanvasContract } from "../../client/interfaces/ValuePropositionCanvasContract";
    import { retreiveValuePropositionFromValuePropositionPageLink } from "../../client/logic/retreiveValuePropositionFromValuePropositionPageLink";
    export let valuePropositionDesignCanvas:ValuePropositionDesignCanvasContract
</script>
<header class="flex flex-col">
    <HeaderTitle title="{valuePropositionDesignCanvas.audience} Value Proposition"/>
</header>
<main class="flex-grow overflow-y-auto">
    <ValuePropositionDesignCanvas {valuePropositionDesignCanvas} />
</main>
<footer class="flex flex-col">
    <Link size="small" linkName="The Lean Canvas" linkHref={links.LeanCanvas}/>
    <Link size="small" linkName="Use Bangarang!" linkHref={links.MainMenu}/>
</footer>
<script lang="ts">
    import Link from "../components/Links/Link.svelte"
    import { links } from "../routing/links";
    import HeaderTitle from "../components/Titles/HeaderTitle.svelte"
    import ValuePropositionDesignCanvas from "../components/Lists/ValuePropositionDesignCanvasList.svelte"
    import type { ValuePropositionDesignCanvasContract } from "../interfaces/ValuePropositionCanvasContract";
    export let valuePropositionDesignCanvas:ValuePropositionDesignCanvasContract
</script>
<header class="flex flex-col">
    <HeaderTitle title="{valuePropositionDesignCanvas.audience} Value Proposition"/>
</header>
<main class="flex-grow overflow-y-auto">
    <ValuePropositionDesignCanvas {valuePropositionDesignCanvas} />
</main>
<footer class="flex flex-col">
    <Link size="small" linkName="The Lean Canvas" linkHref={links.leanCanvas}/>
    <Link size="small" linkName="Use Bangarang!" linkHref={links.mainMenu}/>
</footer>
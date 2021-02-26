<script lang="ts">
    import type { ValuePropositionDesignCanvasContract } from "../interfaces/ValuePropositionCanvasContract";
    export let valuePropositionDesignCanvas:ValuePropositionDesignCanvasContract
    import HeaderTitle from '../components/Titles/HeaderTitle.svelte'
    import ValuePropositionDesignCanvasList from "../components/Lists/ValuePropositionDesignCanvasList.svelte"
    import Link from '../components/Links/Link.svelte'
    import {links} from '../navigation/links'
</script>
<header class="flex flex-col">
    <HeaderTitle title="{valuePropositionDesignCanvas.audience} Value Proposition"/>
</header>
<main class="flex-grow overflow-y-auto">
    <ValuePropositionDesignCanvasList {valuePropositionDesignCanvas} />
</main>
<footer class="flex flex-col">
    <Link size="small" linkName="The Lean Canvas" linkHref={links.LeanCanvas}/>
    <Link size="small" linkName="Use Bangarang!" linkHref={links.MainMenu}/>
</footer>
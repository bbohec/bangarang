<script lang="ts">
    import type { ValuePropositionDesignCanvasContract } from '../../interfaces/ValuePropositionCanvasContract';
    import HeaderTitle from '../Titles/HeaderTitle.svelte'
    export let valuePropositionDesignCanvas:ValuePropositionDesignCanvasContract
</script>
<header class="flex flex-col">
    <HeaderTitle title="{valuePropositionDesignCanvas.audience} Value Proposition"/>
</header>
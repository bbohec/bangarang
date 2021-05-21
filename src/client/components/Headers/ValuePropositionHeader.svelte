<script lang="ts">
    import type { ValuePropositionDesignCanvasContract } from '../../interfaces/ValuePropositionCanvasContract';
    import HeaderTitle from '../Titles/HeaderTitle.svelte'
    export let valuePropositionDesignCanvas:ValuePropositionDesignCanvasContract
</script>
<header class={"flex flex-col flex-grow mx-auto px-1 justify-center items-center max-w-screen-md"}>
    <HeaderTitle 
        message={valuePropositionDesignCanvas.title}
    />
</header>
<script lang="ts">
    import type { ValuePropositionDesignCanvasContract } from "../../interfaces/ValuePropositionCanvasContract";
    import ValuePropositionDesignCanvasList from "../Lists/ValuePropositionDesignCanvasList.svelte"
    export let valuePropositionDesignCanvas:ValuePropositionDesignCanvasContract
</script>
<main class={"flex flex-col flex-grow m-auto p-1 items-center max-w-screen-md overflow-y-auto"}>
    <ValuePropositionDesignCanvasList {valuePropositionDesignCanvas} />
</main>
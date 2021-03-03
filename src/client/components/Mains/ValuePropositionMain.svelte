<script lang="ts">
    import type { ValuePropositionDesignCanvasContract } from "../../interfaces/ValuePropositionCanvasContract";
    import ValuePropositionDesignCanvasList from "../Lists/ValuePropositionDesignCanvasList.svelte"
    export let valuePropositionDesignCanvas:ValuePropositionDesignCanvasContract
</script>
<main class="flex-grow overflow-y-auto">
    <ValuePropositionDesignCanvasList {valuePropositionDesignCanvas} />
</main>
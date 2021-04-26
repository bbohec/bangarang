<script lang="ts">
    import type { ValuePropositionDesignCanvasContract } from "../../interfaces/ValuePropositionCanvasContract";
    import ValuePropositionDesignCanvasList from "../Lists/ValuePropositionDesignCanvasList.svelte"
import { mainWithOverflowClass } from "../Styles/componentStyles";
    export let valuePropositionDesignCanvas:ValuePropositionDesignCanvasContract
</script>
<main class={mainWithOverflowClass}>
    <ValuePropositionDesignCanvasList {valuePropositionDesignCanvas} />
</main>
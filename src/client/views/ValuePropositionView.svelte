<script lang="ts">
    import type { ValuePropositionDesignCanvasContract } from "../interfaces/ValuePropositionCanvasContract";
    export let valuePropositionDesignCanvas:ValuePropositionDesignCanvasContract
    import ValuePropositionHeader from "../components/Headers/ValuePropositionHeader.svelte";
    import ValuePropositionMain from "../components/Mains/ValuePropositionMain.svelte";
    import ValuePropositionFooter from "../components/Footers/ValuePropositionFooter.svelte";
</script>
<ValuePropositionHeader {valuePropositionDesignCanvas}/>
<ValuePropositionMain {valuePropositionDesignCanvas}/>
<ValuePropositionFooter/>
<script lang="ts" context="module">
	export async function preload(page:any, session:any) {
        const { valuePropositionPageLink } = page.params;
        const valuePropositionDesignCanvas:ValuePropositionDesignCanvasContract=retreiveValuePropositionFromValuePropositionPageLink(valuePropositionPageLink)
		return { valuePropositionDesignCanvas };
	}
</script>
<script lang="ts">
    import ValuePropositionView from '../../client/views/ValuePropositionView.svelte'
    import type { ValuePropositionDesignCanvasContract } from "../../client/interfaces/ValuePropositionCanvasContract";
    import { retreiveValuePropositionFromValuePropositionPageLink } from "../../client/logic/valueProposition/retreiveValuePropositionFromValuePropositionPageLink";
    export let valuePropositionDesignCanvas:ValuePropositionDesignCanvasContract
</script>
<ValuePropositionView valuePropositionDesignCanvas={valuePropositionDesignCanvas}/>
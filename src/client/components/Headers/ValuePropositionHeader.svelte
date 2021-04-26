<script lang="ts">
    import type { ValuePropositionDesignCanvasContract } from '../../interfaces/ValuePropositionCanvasContract';
    import { Message } from '../../logic/language';
    import { languageStore } from '../../stores/languageStore';
    import { headerCenteredClass } from '../Styles/componentStyles';
    import HeaderTitle from '../Titles/HeaderTitle.svelte'
    export let valuePropositionDesignCanvas:ValuePropositionDesignCanvasContract
</script>
<header class={headerCenteredClass}>
    <HeaderTitle 
        title={new Message(valuePropositionDesignCanvas.title).getMessage($languageStore)}
    />
</header>
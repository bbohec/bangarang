<script lang="ts">
    import type { MessageContract } from "../../../logic/language";
    import { Message } from "../../../logic/language";
    import { languageStore } from "../../../stores/languageStore";
    export let destinationMessage:MessageContract = {en:"Missing Message!",fr:"Message manquant!"}
    export let onClickAction:()=>void
    export let svgHtml:string = 'Missing SVG'
</script>
<button 
    class="flex flex-col items-center px-1 w-20 text-bangarang-darkEmphasis"
    on:click={onClickAction}
>
    {@html svgHtml}
    <p class="text-xs">{new Message(destinationMessage).getMessage($languageStore)}</p>
</button>
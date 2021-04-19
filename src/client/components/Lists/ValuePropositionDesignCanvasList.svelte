<script lang="ts">
    import type { ValuePropositionDesignCanvasContract } from "../../interfaces/ValuePropositionCanvasContract";
    import { Message } from "../../logic/language";
    import type {MessageContract} from "../../logic/language";
    import {retrieveSubTitleFromType} from "../../logic/messages"
    import { languageStore } from "../../stores/languageStore";
    export let valuePropositionDesignCanvas:ValuePropositionDesignCanvasContract;
    const sections: [string, MessageContract|MessageContract[]][] = Object.entries(valuePropositionDesignCanvas)
</script>
{#each sections as [type,contents] }
    {#if type !== "audience" && type !== "pageLink" && Array.isArray(contents) && contents.length > 0}
        <section>
            <h1 class="text-sm mt-4 mb-1 text-bangarang-darkEmphasis font-semibold text-center">{new Message(retrieveSubTitleFromType(type)).getMessage($languageStore).toLocaleUpperCase()}</h1>
            {#if contents.length > 1 }
                <ul class="list-disc list-inside">
                    {#each contents as content}
                        <li class="text-bangarang-darkEmphasis text-sm">{new Message(content).getMessage($languageStore)}</li>
                    {/each}
                </ul>
            {:else}
                <p class="text-bangarang-darkEmphasis text-sm text-center">{new Message(contents[0]).getMessage($languageStore)}</p>
            {/if}
        </section>
    {/if}
{/each}


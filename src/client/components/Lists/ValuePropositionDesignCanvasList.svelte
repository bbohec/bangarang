<script lang="ts">
    import type { ValuePropositionDesignCanvasContract } from "../../interfaces/ValuePropositionCanvasContract";
    export let valuePropositionDesignCanvas:ValuePropositionDesignCanvasContract;
    const sections: [string, string|string[]][] = Object.entries(valuePropositionDesignCanvas)
    const retrieveSubTitleFromType = (type:string):string => {
        if (type === 'customerJobs')return `You have activities`
        if (type === 'pains')return `But you have pains`
        if (type === 'painRelievers')return `We want to help you`
        if (type === 'productAndServices')return `We have a solution`
        if (type === 'gainCreators')return `We provide additionnal capabilities`
        if (type === 'gains')return `You can acheive more`
        return `!!!ERROR UNKNOWN TYPE!!!`
    }
</script>

{#each sections as [type,contents] }
    {#if type !== "audience" && type !== "pageLink" && Array.isArray(contents) && contents.length > 0}
        <section>
            <h1 class="text-sm mt-4 mb-1 text-bangarang-darkEmphasis font-semibold text-center">{retrieveSubTitleFromType(type).toLocaleUpperCase()}</h1>
            {#if contents.length > 1 }
                <ul class="list-disc list-inside">
                    {#each contents as content}
                        <li class="text-bangarang-darkEmphasis text-sm">{content}</li>
                    {/each}
                </ul>
            {:else}
                <p class="text-bangarang-darkEmphasis text-sm text-center">{contents[0]}</p>
            {/if}
        </section>
    {/if}
{/each}


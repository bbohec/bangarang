<script lang="ts">
    import {leanCanvas} from "../../logic/leanCanvas/leanCanvas"
    import MainTitle from "../Titles/MainTitle.svelte"
    import DescriptionCard from "../Cards/DescriptionCard.svelte"
</script>
<main class="flex-grow overflow-y-auto">
    {#each leanCanvas as leanCanvasPart}
        <MainTitle title={leanCanvasPart.partName} position="center"/>
        {#each leanCanvasPart.sections as section}
            <DescriptionCard descriptionCardContract={section}/>
        {/each}
    {/each}
</main>
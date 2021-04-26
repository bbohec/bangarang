<script lang="ts">
    import MainTitle from "../Titles/MainTitle.svelte"
    import DescriptionCard from "../Cards/DescriptionCard.svelte"
    import { languageStore } from "../../stores/languageStore";
    import {leanCanvas} from "../../logic/messages"
</script>
<main class={"flex flex-col flex-grow m-auto p-1 items-center max-w-screen-md overflow-y-auto"}>
    {#each leanCanvas($languageStore) as leanCanvasPart}
        <MainTitle title={leanCanvasPart.partName} position="center"/>
        {#each leanCanvasPart.sections as section}
            <DescriptionCard descriptionCardContract={section}/>
        {/each}
    {/each}
</main>
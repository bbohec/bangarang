<script lang="ts">
    import MainTitle from "../Titles/MainTitle.svelte"
    import DescriptionCard from "../Cards/DescriptionCard.svelte"
    import { languageStore } from "../../stores/languageStore";
    import {leanCanvas} from "../../logic/messages"
    import { mainWithOverflowClass } from "../Styles/componentStyles";
</script>
<main class={`${mainWithOverflowClass}`}>
    {#each leanCanvas($languageStore) as leanCanvasPart}
        <MainTitle title={leanCanvasPart.partName} position="center"/>
        {#each leanCanvasPart.sections as section}
            <DescriptionCard descriptionCardContract={section}/>
        {/each}
    {/each}
</main>
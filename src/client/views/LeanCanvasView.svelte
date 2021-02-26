<script lang="ts">
     import {leanCanvas} from "../logic/leanCanvas/leanCanvas"
     import HeaderTitle from "../components/Titles/HeaderTitle.svelte"
     import MainTitle from "../components/Titles/MainTitle.svelte"
     import DescriptionCard from "../components/Cards/DescriptionCard.svelte"
     import Link from "../components/Links/Link.svelte"
    import { links } from "../navigation/links";
</script>
<header class="flex flex-col">
    <HeaderTitle title="Bangarang Lean Canvas"/>
</header>
<main class="flex-grow overflow-y-auto">
    {#each leanCanvas as leanCanvasPart}
        <MainTitle title={leanCanvasPart.partName}/>
        {#each leanCanvasPart.sections as section}
            <DescriptionCard descriptionCardContract={section}/>
        {/each}
    {/each}
</main>
<footer class="flex flex-col">
    <Link size="small" linkName="The Business Model" linkHref={links.BusinessModel}/>
    <Link size="small" linkName="Use Bangarang!" linkHref={links.MainMenu}/>
</footer>
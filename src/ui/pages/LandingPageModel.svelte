<script lang="ts">
    import MainTitle from "../components/Titles/MainTitle.svelte"
    import MainSubTitle from "../components/Titles/MainSubTitle.svelte"
    import GenericButton from "../components/Buttons/GenericButton.svelte"
    import { navigate } from "svelte-routing";
    import {links} from "../routing/links"
    export let mainHeadLine:string|undefined
    export let supportingHeadline:string|undefined
    const navigateToBangarang = ():void=> navigate(links.mainMenu)
    const theme:"light"|"dark"="dark"
</script>
<main class="flex-grow overflow-y-auto flex flex-col items-center justify-evenly bg-bangarang-dark">
    <section>
        {#if mainHeadLine}
        <MainTitle title={mainHeadLine} size="large" {theme}/>
        {/if}
        {#if supportingHeadline}
            <MainSubTitle title={`Use Bangarang and ${supportingHeadline.toLocaleLowerCase()}`} {theme}/>
        {/if}
    </section>
    <GenericButton textbutton="Get started" customClasses="w-11/12" size="large" color="dark" onClickAction={navigateToBangarang}/>
</main>
<script lang="ts">
    import MainTitle from "../components/Titles/MainTitle.svelte"
    import MainSubTitle from "../components/Titles/MainSubTitle.svelte"
    import GenericButton from "../components/Buttons/GenericButton.svelte"
    import { navigate } from "svelte-routing";
    import {links} from "../routing/links"
    export let mainHeadLine:string|undefined
    export let supportingHeadline:string|undefined
    const navigateToBangarang = ():void=> navigate(links.mainMenu)
</script>
<main class="flex-grow overflow-y-auto flex flex-col items-center justify-center">
    {#if mainHeadLine}
        <MainTitle title={mainHeadLine} size="large"/>
    {/if}
    {#if supportingHeadline}
        <MainSubTitle title={`Try Bangarang and ${supportingHeadline.toLocaleLowerCase()}`}/>
    {/if}
    <GenericButton textbutton="Try Now!" size="large" onClickAction={navigateToBangarang}/>
</main>
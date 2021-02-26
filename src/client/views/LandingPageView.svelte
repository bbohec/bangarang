<script lang="ts">
    export let mainHeadLine:string|undefined
    export let supportingHeadLine:string|undefined
    import MainTitle from '../components/Titles/MainTitle.svelte'
    import MainSubTitle from '../components/Titles/MainSubTitle.svelte'
    import GenericButton from '../components/Buttons/GenericButton.svelte'
    import { links } from '../navigation/links';
    const theme:"light"|"dark"="dark"
    const navigateToBangarang = ():void=> {window.location.href = links.MainMenu}
</script>
<main class="flex-grow overflow-y-auto flex flex-col items-center justify-evenly bg-bangarang-dark">
    <section>
        {#if mainHeadLine}
            <MainTitle title={mainHeadLine} size="large" {theme}/>
        {/if}
        {#if supportingHeadLine}
            <MainSubTitle title={`Use Bangarang and ${supportingHeadLine.toLocaleLowerCase()}`} {theme}/>
        {/if}
    </section>
    <GenericButton textbutton="Get started" customClasses="w-11/12" size="large" color="dark" onClickAction={navigateToBangarang}/>
</main>
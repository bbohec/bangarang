<script lang="ts">
    import MainTitle from '../Titles/MainTitle.svelte'
    import MainSubTitle from '../Titles/MainSubTitle.svelte'
    import GenericButton from '../Buttons/GenericButton.svelte'
    import { StaticView } from '../../port/interactors/BangarangUserInterfaceInteractor';
    import { languageStore } from '../../stores/languageStore';
    import {painRelieversToSupportingHeadLine} from '../../logic/valueProposition/valuePropositions'
    import { Message } from '../../logic/language';
    import { callToActionMessage } from '../../logic/messages';
    export let mainHeadLine:string|undefined
    export let supportingHeadLine:string|undefined
    const theme:"light"|"dark"="dark"
    const navigateToBangarang = ():void=> {window.location.href = `/${$languageStore}/${StaticView.MainMenu}`}
</script>
<main class={"flex flex-col flex-grow m-auto p-3 justify-evenly max-w-screen-md"}>
    {#if mainHeadLine}
        <MainTitle 
            title={mainHeadLine} 
            size="large" 
            customClasses="w-3/4"
            {theme}
        />
    {/if}
    {#if supportingHeadLine}
        <MainSubTitle 
            title={painRelieversToSupportingHeadLine($languageStore,supportingHeadLine)}
            customClasses="w-3/4 self-end"
            {theme}
        />
    {/if}
    <GenericButton buttonType="Contained Button" textLabel={new Message(callToActionMessage).getMessage($languageStore)} customClasses="w-56 self-center" onClickAction={navigateToBangarang}/>
</main>
<script lang="ts">
    import MainTitle from '../Titles/MainTitle.svelte'
    import MainSubTitle from '../Titles/MainSubTitle.svelte'
    import GenericButton from '../Buttons/GenericButton.svelte'
    import { StaticView } from '../../port/interactors/BangarangUserInterfaceInteractor';
    import { languageStore } from '../../stores/languageStore';
    import {painRelieversToSupportingHeadLine} from '../../logic/valueProposition/valuePropositions'
    import { Message } from '../../logic/language';
    import { callToActionMessage } from '../../logic/messages';
    import { mainClass } from '../Styles/componentStyles';
    export let mainHeadLine:string|undefined
    export let supportingHeadLine:string|undefined
    const theme:"light"|"dark"="dark"
    const navigateToBangarang = ():void=> {window.location.href = `/${$languageStore}/${StaticView.MainMenu}`}
</script>
<main class={mainClass}>
    <section>
        {#if mainHeadLine}
            <MainTitle title={mainHeadLine} size="large" {theme}/>
        {/if}
        {#if supportingHeadLine}
            <MainSubTitle title={painRelieversToSupportingHeadLine($languageStore,supportingHeadLine)} {theme}/>
        {/if}
    </section>
    <GenericButton textbutton={new Message(callToActionMessage).getMessage($languageStore)} customClasses="w-11/12" size="large" color="dark" onClickAction={navigateToBangarang}/>
</main>
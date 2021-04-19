<script lang="ts">
    import { goto } from '@sapper/app';
    import ClaimSearchBar from "../SearchBars/ClaimSearchBar.svelte"
    import GenericButton from "../Buttons/GenericButton.svelte"
    import Link from "../Links/Link.svelte"
    import { declareClaimTextButtonMessage, faqLinkNameMessage } from '../../logic/messages';
    import { Message } from '../../logic/language';
    import { languageStore } from '../../stores/languageStore';
    import { StaticView } from '../../port/interactors/BangarangUserInterfaceInteractor';
    const navigateToUrl = ():void => goto(StaticView.DeclareClaim)
</script>
<footer class="flex flex-col mb-1 mx-auto max-w-screen-2xl">
    <ClaimSearchBar/>
    <GenericButton 
        textbutton={new Message(declareClaimTextButtonMessage).getMessage($languageStore)} 
        onClickAction={navigateToUrl}
    />
    <Link 
        linkName={new Message(faqLinkNameMessage).getMessage($languageStore)} 
        linkHref={`/${$languageStore}/${StaticView.BusinessModel}`}
        size="small"
    />
</footer>
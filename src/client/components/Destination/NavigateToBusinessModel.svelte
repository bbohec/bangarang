<script lang="ts">
    import { goto } from '@sapper/app';
    import { faqLinkNameMessage } from '../../logic/messages';
    import { StaticView } from "../../port/interactors/BangarangUserInterfaceInteractor";
    import { languageStore } from "../../stores/languageStore";
    import { informationCircle } from '../Icons/heroicon';
    import GenericDestination from "./GenericDestination.svelte"
    const navigateToUrl = (url:string):void => goto(url)
    const navigateToBusinessModel = ():void => navigateToUrl(`/${$languageStore}/${StaticView.BusinessModel}`)
</script>
<GenericDestination
    destinationMessage={faqLinkNameMessage}
    onClickAction={navigateToBusinessModel}
    svgHtml={informationCircle}
/>
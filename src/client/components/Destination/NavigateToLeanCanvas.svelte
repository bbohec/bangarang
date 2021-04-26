<script lang="ts">
    import { goto } from '@sapper/app';
    import { leanCanvasLinkMessage } from '../../logic/messages';
    import { StaticView } from "../../port/interactors/BangarangUserInterfaceInteractor";
    import { languageStore } from "../../stores/languageStore";
    import { library } from '../Icons/heroicon';
    import GenericDestination from "./GenericDestination.svelte"
    const navigateToUrl = (url:string):void => goto(url)
    const navigateToBusinessModel = ():void => navigateToUrl(`/${$languageStore}/${StaticView.LeanCanvas}`)
</script>
<GenericDestination
    destinationMessage={leanCanvasLinkMessage}
    onClickAction={navigateToBusinessModel}
    svgHtml={library}
/>
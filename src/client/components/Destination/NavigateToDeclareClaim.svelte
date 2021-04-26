<script lang="ts">
    import { goto } from '@sapper/app';
    import { declareClaimTextButtonMessage } from '../../logic/messages';
    import { StaticView } from "../../port/interactors/BangarangUserInterfaceInteractor";
    import { languageStore } from "../../stores/languageStore";
    import { documentAddSvg } from '../Icons/heroicon';
    import GenericDestination from "./GenericDestination.svelte"
    const navigateToUrl = (url:string):void => goto(url)
    const navigateToDeclareClaim = ():void => navigateToUrl(`/${$languageStore}/${StaticView.DeclareClaim}`)
</script>
<GenericDestination
    destinationMessage={declareClaimTextButtonMessage}
    onClickAction={navigateToDeclareClaim}
    svgHtml={documentAddSvg}
/>
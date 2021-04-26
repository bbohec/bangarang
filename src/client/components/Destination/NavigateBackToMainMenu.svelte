<script lang="ts">
    import { goto } from '@sapper/app';
    import { backToMainMenuLinkMessage } from '../../logic/messages';
    import { StaticView } from "../../port/interactors/BangarangUserInterfaceInteractor";
    import { languageStore } from "../../stores/languageStore";
    import { chevronDoubleLeft } from '../Icons/heroicon';
    import GenericDestination from "./GenericDestination.svelte"
    const navigateToUrl = (url:string):void => goto(url)
    const navigateToDeclareClaim = ():void => navigateToUrl(`/${$languageStore}/${StaticView.MainMenu}`)
</script>
<GenericDestination
    destinationMessage={backToMainMenuLinkMessage}
    onClickAction={navigateToDeclareClaim}
    svgHtml={chevronDoubleLeft}
/>
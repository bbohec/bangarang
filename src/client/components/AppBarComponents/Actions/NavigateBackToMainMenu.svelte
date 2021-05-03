<script lang="ts">
    import { goto } from '@sapper/app';
    import { backToMainMenuLinkMessage } from '../../../logic/messages';
    import { StaticView } from "../../../port/interactors/BangarangUserInterfaceInteractor";
    import { languageStore } from "../../../stores/languageStore";
    import { chevronDoubleLeft } from '../../Icons/heroicon';
    import GenericInteractiveAction from "./GenericInteractiveAction.svelte"
    const navigateToDeclareClaim = ():void => goto(`/${$languageStore}/${StaticView.MainMenu}`)
</script>
<GenericInteractiveAction
    destinationMessage={backToMainMenuLinkMessage}
    onClickAction={navigateToDeclareClaim}
    svgHtml={chevronDoubleLeft}
/>
<script lang="ts">
    import { goto } from '@sapper/app';
    import { declareClaimTextButtonMessage } from '../../../logic/messages';
    import { StaticView } from "../../../port/interactors/BangarangUserInterfaceInteractor";
    import { languageStore } from "../../../stores/languageStore";
    import { documentAddSvg } from '../../Icons/heroicon';
    import GenericInteractiveAction from "./GenericInteractiveAction.svelte"
    const navigateToDeclareClaim = ():void => goto(`/${$languageStore}/${StaticView.DeclareClaim}`)
</script>
<GenericInteractiveAction
    destinationMessage={declareClaimTextButtonMessage}
    onClickAction={navigateToDeclareClaim}
    svgHtml={documentAddSvg}
/>
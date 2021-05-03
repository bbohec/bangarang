<script lang="ts">
    import { goto } from '@sapper/app';
    import { leanCanvasLinkMessage } from '../../../logic/messages';
    import { StaticView } from "../../../port/interactors/BangarangUserInterfaceInteractor";
    import { languageStore } from "../../../stores/languageStore";
    import { library } from '../../Icons/heroicon';
    import GenericInteractiveAction from "./GenericInteractiveAction.svelte"
    const navigateToBusinessModel = ():void => goto(`/${$languageStore}/${StaticView.LeanCanvas}`)
</script>
<GenericInteractiveAction
    destinationMessage={leanCanvasLinkMessage}
    onClickAction={navigateToBusinessModel}
    svgHtml={library}
/>
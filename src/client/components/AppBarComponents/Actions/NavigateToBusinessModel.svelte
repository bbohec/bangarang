<script lang="ts">
    import { goto } from '@sapper/app';
    import { faqLinkNameMessage } from '../../../logic/messages';
    import { StaticView } from "../../../port/interactors/BangarangUserInterfaceInteractor";
    import { languageStore } from "../../../stores/languageStore";
    import { informationCircle } from '../../Icons/heroicon';
    import GenericInteractiveAction from "./GenericInteractiveAction.svelte"
    const navigateToBusinessModel = ():void => goto(`/${$languageStore}/${StaticView.BusinessModel}`)
</script>
<GenericInteractiveAction
    destinationMessage={faqLinkNameMessage}
    onClickAction={navigateToBusinessModel}
    svgHtml={informationCircle}
/>
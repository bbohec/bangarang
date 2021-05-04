<script lang="ts">
    import { goto } from '@sapper/app';
    import { signInRegisterMessage } from '../../../logic/messages';
    import { StaticView } from "../../../port/interactors/BangarangUserInterfaceInteractor";
    import { languageStore } from "../../../stores/languageStore";
    import { identification } from '../../Icons/heroicon';
    import GenericInteractiveAction from "./GenericInteractiveAction.svelte"
    const navigateToRegisterMenu = ():void => goto(`/${$languageStore}/${StaticView.Register}`)
</script>
<GenericInteractiveAction
    destinationMessage={signInRegisterMessage}
    onClickAction={navigateToRegisterMenu}
    svgHtml={identification}
/>
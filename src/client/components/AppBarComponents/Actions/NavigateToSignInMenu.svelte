<script lang="ts">
    import { goto } from '@sapper/app';
    import { backToSignInMenuMessage } from '../../../logic/messages';
    import { StaticView } from "../../../port/interactors/BangarangUserInterfaceInteractor";
    import { languageStore } from "../../../stores/languageStore";
    import { logIn } from '../../Icons/heroicon';
    import GenericInteractiveAction from "./GenericInteractiveAction.svelte"
    const navigateToSignInMenu = ():void => goto(`/${$languageStore}/${StaticView.SigningInMenu}`)
</script>
<GenericInteractiveAction
    destinationMessage={backToSignInMenuMessage}
    onClickAction={navigateToSignInMenu}
    svgHtml={logIn}
/>
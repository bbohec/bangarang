<script lang="ts">
    import { goto } from '@sapper/app';
    import { backToSignInMenuMessage } from '../../logic/messages';
    import { StaticView } from "../../port/interactors/BangarangUserInterfaceInteractor";
    import { languageStore } from "../../stores/languageStore";
    import { logIn } from '../Icons/heroicon';
    import GenericDestination from "./GenericDestination.svelte"
    const navigateToUrl = (url:string):void => goto(url)
    const navigateToDeclareClaim = ():void => navigateToUrl(`/${$languageStore}/${StaticView.SigningInMenu}`)
</script>
<GenericDestination
    destinationMessage={backToSignInMenuMessage}
    onClickAction={navigateToDeclareClaim}
    svgHtml={logIn}
/>
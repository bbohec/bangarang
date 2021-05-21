<script lang="ts">
    import { goto } from '@sapper/app';
    import { backToTheClaimMessage } from '../../../logic/messages';
    import { linkPrefixes } from '../../../port/interactors/BangarangUserInterfaceInteractor';
    import { languageStore } from "../../../stores/languageStore";
    import { documentText } from '../../Icons/heroicon';
    import GenericInteractiveAction from "./GenericInteractiveAction.svelte"
    export let currentClaimId:string
    const navigateToCurrentClaim = ():void => goto(`/${$languageStore}/${linkPrefixes.claimLinkPrefix}${currentClaimId}`)
</script>
<GenericInteractiveAction
    destinationMessage={backToTheClaimMessage}
    onClickAction={navigateToCurrentClaim}
    svgHtml={documentText}
/>
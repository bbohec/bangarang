<script lang="ts">
    import { backToMainMenuLinkMessage } from '../../../logic/messages';
    import { claimSearchCriteriaStore } from '../../../stores/claimSearchStore';
    import { home } from '../../Icons/heroicon';
    import GenericInteractiveAction from "./GenericInteractiveAction.svelte"
    const resetClaimSearch = () => $claimSearchCriteriaStore = '';
</script>
<GenericInteractiveAction
    destinationMessage={backToMainMenuLinkMessage}
    onClickAction={resetClaimSearch}
    svgHtml={home}
/>
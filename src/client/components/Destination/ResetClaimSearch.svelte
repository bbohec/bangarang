<script lang="ts">
    import { backToMainMenuLinkMessage } from '../../logic/messages';
    import { claimSearchCriteriaStore } from '../../stores/claimSearchStore';
    import { home } from '../Icons/heroicon';
    import GenericDestination from "./GenericDestination.svelte"
    const resetClaimSearch = () => $claimSearchCriteriaStore = '';
</script>
<GenericDestination
    destinationMessage={backToMainMenuLinkMessage}
    onClickAction={resetClaimSearch}
    svgHtml={home}
/>
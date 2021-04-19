<script lang="ts">
    import BackIcon from '../Icons/BackIcon.svelte'
    import {claimSearchCriteriaStore} from '../../stores/claimSearchStore'
    import { Message } from '../../logic/language';
    import { backToMainMenuLinkMessage } from '../../logic/messages';
    import { languageStore } from '../../stores/languageStore';
    const resetClaimSearch = () => $claimSearchCriteriaStore = '';
</script>
<span class="flex items-center px-2" ><BackIcon/><p class="text-xs text-bangarang-darkEmphasis underline" on:click={resetClaimSearch}>{new Message(backToMainMenuLinkMessage).getMessage($languageStore)}</p></span>
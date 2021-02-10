<script lang="ts">
    import BackIcon from '../Icons/BackIcon.svelte'
    import {claimSearchStore} from '../../stores/claimSearchStore'
    const resetClaimSearch = () => $claimSearchStore = '';
</script>
<span class="flex items-center px-2" ><BackIcon/><p class="text-xs text-bangarang-darkEmphasis underline" on:click={resetClaimSearch}>Back to main menu.</p></span>
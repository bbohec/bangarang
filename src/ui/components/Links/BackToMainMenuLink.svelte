<script lang="ts">
    import BackIcon from '../../components/Icons/BackIcon.svelte'
    import {claimSearchStore} from '../../stores/claimSearchStore'
    const resetClaimSearch = () => $claimSearchStore = '';
</script>

<span class="inline-flex items-center px-3" ><BackIcon/><p class="text-xs text-bangarang-darkEmphasis underline" on:click={resetClaimSearch}>Back to main menu.</p></span>
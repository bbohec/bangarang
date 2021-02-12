<script lang="ts">
    import Spinner from "../Icons/Spinner.svelte"
    import Success from "../Icons/Success.svelte"
    import {claimingStore} from "../../stores/claimingStore"
</script>
{#if $claimingStore.claimingStatus === "claiming"}
    <p class="text-right text-bangarang-lightEmphasis flex items-center justify-end">Claiming...<Spinner/></p>
{:else if $claimingStore.claimingStatus === "claimed"}
    <p class="text-right text-bangarang-lightEmphasis flex items-center justify-end">Claimed.<Success/></p>
{/if}

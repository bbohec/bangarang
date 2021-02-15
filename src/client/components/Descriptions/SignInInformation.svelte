<script lang="ts">
    import Spinner from "../Icons/Spinner.svelte"
    import Success from "../Icons/Success.svelte"
    import {signInStore} from "../../stores/signInStore"
</script>
{#if $signInStore.signInStatus === "signing in"}
    <p class="text-right text-bangarang-lightEmphasis flex items-center justify-end">Signing in...<Spinner/></p>
{:else if $signInStore.signInStatus === "signed in"}
    <p class="text-right text-bangarang-lightEmphasis flex items-center justify-end">Signed in.<Success/></p>
{/if}

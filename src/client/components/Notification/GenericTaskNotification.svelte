<script lang="ts">
    import type { UserNotificationContract } from "../../port/UserNotification";
    import Spinner from "../Icons/Spinner.svelte"
    import Success from "../Icons/Success.svelte"
    import Failed from "../Icons/Failed.svelte"
    export let taskNotification:UserNotificationContract;
</script>
{#if taskNotification.status === "Executing"}
    <p class="text-right text-bangarang-lightEmphasis flex items-center justify-end">{taskNotification.message}<Spinner/></p>
{:else if taskNotification.status === "Success"}
    <p class="text-right text-bangarang-lightEmphasis flex items-center justify-end">{taskNotification.message}<Success/></p>
{:else if taskNotification.status === "Failed"}
    <p class="text-right text-bangarang-lightEmphasis flex items-center justify-end">{taskNotification.message}<Failed/></p>
{/if}
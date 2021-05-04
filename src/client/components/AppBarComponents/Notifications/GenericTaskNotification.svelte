<script lang="ts">
    import type { UserNotificationContract } from "../../../port/UserNotification";
    import { Message } from "../../../logic/language";
    import { languageStore } from "../../../stores/languageStore";
    import Spinner from "../../Icons/Spinner.svelte"
    import Success from "../../Icons/Success.svelte"
    import Failed from "../../Icons/Failed.svelte"
    export let taskNotification:UserNotificationContract;
</script>
<section class="flex flex-col items-center px-1 w-40 text-bangarang-lightEmphasis">
    {#if taskNotification.status === "Executing"}
        <Spinner/>
    {:else if taskNotification.status === "Success"}
        <Success/>
    {:else if taskNotification.status === "Failed"}
        <Failed/>
    {/if}  
    <p class="text-xs text-center">{new Message(taskNotification.message).getMessage($languageStore)}</p>
</section>

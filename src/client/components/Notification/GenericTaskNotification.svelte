<script lang="ts">
    import type { UserNotificationContract } from "../../port/UserNotification";
    import Spinner from "../Icons/Spinner.svelte"
    import Success from "../Icons/Success.svelte"
    import Failed from "../Icons/Failed.svelte"
    import { Message } from "../../logic/language";
    import { languageStore } from "../../stores/languageStore";
    export let taskNotification:UserNotificationContract;
</script>
<p class="text-right text-bangarang-lightEmphasis flex items-center justify-end">{new Message(taskNotification.message).getMessage($languageStore)}
    {#if taskNotification.status === "Executing"}
        <Spinner/>
    {:else if taskNotification.status === "Success"}
        <Success/>
    {:else if taskNotification.status === "Failed"}
        <Failed/>
    {/if}    
</p>

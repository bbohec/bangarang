<script lang="ts">
    import {claimingUserNotificationStore} from "../../stores/claimingStore"
    import {declaringClaimUserNotificationStore} from "../../stores/declaringClaimStore"
    import ClaimShare from "../Destination/ClaimShare.svelte"
    import ClaimingInformation from "../Notification/ClaimingInformation.svelte"
    import DeclaringInformation from "../Notification/DeclaringInformation.svelte";
    import NavigateBackToMainMenu from "../Destination/NavigateBackToMainMenu.svelte"
    
import { claimCopiedErrorMessage, claimCopiedSuccessMessage } from "../../logic/messages";
import { Message } from "../../logic/language";
import { languageStore } from "../../stores/languageStore";
    let URICopiedToClipboard:boolean=false;
    let URICopyToClipboardError:Error|undefined = undefined;
    const copyUriToClipboard = ():void => {
        navigator.clipboard.writeText(window.location.href)
            .then(() => {URICopiedToClipboard = true;})
            .catch((error:Error) => {
                URICopiedToClipboard = false
                URICopyToClipboardError=error
            });   
    }
</script>
<footer class={"flex flex-col pt-2 pb-16 lg:pb-1 bg-bangarang-veryLightEmphasis"}>
    {#if $claimingUserNotificationStore.status !== "Executing" && $declaringClaimUserNotificationStore.status !== "Executing"}
        <section class={"flex w-full max-w-screen-md justify-between m-auto"}>
            <NavigateBackToMainMenu/>
            {#if URICopiedToClipboard}
                <p class="text-center w-1/2 text-xs text-bangarang-success">{new Message(claimCopiedSuccessMessage).getMessage($languageStore)}</p>
            {:else}
                {#if URICopyToClipboardError !== undefined}
                <p class="text-center w-1/2 text-xs text-bangarang-failed">{`${new Message(claimCopiedErrorMessage).getMessage($languageStore)}: ${URICopyToClipboardError.message}`}</p>
                {/if}
            {/if}
            <ClaimShare {copyUriToClipboard}/>
        </section>
        {#if $claimingUserNotificationStore.status !== "Idle"}
            <ClaimingInformation/>
        {:else if $declaringClaimUserNotificationStore.status !== "Idle"}
            <DeclaringInformation/>
        {/if}
    {:else if $declaringClaimUserNotificationStore.status === "Executing"}
        <DeclaringInformation/>
    {:else if $claimingUserNotificationStore.status === "Executing"}
        <ClaimingInformation/>
    {/if}
</footer>
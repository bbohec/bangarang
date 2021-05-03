<script lang="ts">
    import {claimingUserNotificationStore} from "../../stores/claimingStore"
    import {declaringClaimUserNotificationStore} from "../../stores/declaringClaimStore"
    import ClaimShare from "../AppBarComponents/Actions/ClaimShare.svelte"
    import ClaimingInformation from "../AppBarComponents/Notifications/ClaimingInformation.svelte"
    import DeclaringInformation from "../AppBarComponents/Notifications/DeclaringInformation.svelte";
    import NavigateBackToMainMenu from "../AppBarComponents/Actions/NavigateBackToMainMenu.svelte";
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
    <section class={"flex w-full max-w-screen-md justify-between md:justify-around lg:justify-evenly m-auto"}>
        {#if $claimingUserNotificationStore.status !== "Executing" && $declaringClaimUserNotificationStore.status !== "Executing"}
            <NavigateBackToMainMenu/>
            {#if URICopiedToClipboard}
                <p class="text-center w-1/2 text-xs text-bangarang-success">{new Message(claimCopiedSuccessMessage).getMessage($languageStore)}</p>
            {:else}
                {#if URICopyToClipboardError !== undefined}
                <p class="text-center w-1/2 text-xs text-bangarang-failed">{`${new Message(claimCopiedErrorMessage).getMessage($languageStore)}: ${URICopyToClipboardError.message}`}</p>
                {/if}
            {/if}
            {#if $claimingUserNotificationStore.status !== "Idle"}
                <ClaimingInformation/>
            {:else if $declaringClaimUserNotificationStore.status !== "Idle"}
                <DeclaringInformation/>
            {/if}
            <ClaimShare {copyUriToClipboard}/>
        {:else if $declaringClaimUserNotificationStore.status === "Executing"}
            <DeclaringInformation/>
        {:else if $claimingUserNotificationStore.status === "Executing"}
            <ClaimingInformation/>
        {/if}
    </section>
</footer>
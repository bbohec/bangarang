<script lang="ts">
    import {links} from "../../navigation/links"
    import {claimingUserNotificationStore} from "../../stores/claimingStore"
    import {declaringClaimUserNotificationStore} from "../../stores/declaringClaimStore"
    import Link from "../Links/Link.svelte"
    import ClaimShare from "../Links/ClaimShare.svelte"
    import ClaimingInformation from "../Notification/ClaimingInformation.svelte"
    import DeclaringInformation from "../Notification/DeclaringInformation.svelte";
</script>
<footer class="flex flex-col p-1 mx-auto max-w-screen-2xl">
    {#if $claimingUserNotificationStore.status === "Executing"}
        <ClaimingInformation/>
    {:else if $declaringClaimUserNotificationStore.status === "Executing"}
        <DeclaringInformation/>
    {:else}
        <ClaimShare/>
        <section class="flex justify-between items-center">
            <Link size="small" linkHref={links.MainMenu} linkName="<< Back to main menu." textAlign={"text-left"}/>
            {#if $claimingUserNotificationStore.status === "Success" || $claimingUserNotificationStore.status === "Failed"}
                <ClaimingInformation/>
            {:else if $declaringClaimUserNotificationStore.status === "Success" || $declaringClaimUserNotificationStore.status === "Failed"}
                <DeclaringInformation/>
            {/if}
        </section>
    {/if}
</footer>
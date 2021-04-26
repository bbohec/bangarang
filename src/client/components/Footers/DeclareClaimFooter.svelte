<script lang="ts">
    import DeclaringInformation from "../Notification/DeclaringInformation.svelte"
    import { declaringClaimUserNotificationStore } from "../../stores/declaringClaimStore";
    import NavigateBackToMainMenu from "../Destination/NavigateBackToMainMenu.svelte"
    import { appBarClass, footerClass } from "../Styles/componentStyles";
</script>
<footer class={footerClass}>
    {#if $declaringClaimUserNotificationStore.status !== "Executing"}
        <section class={appBarClass}>
            <NavigateBackToMainMenu/>
        </section>
        {#if $declaringClaimUserNotificationStore.status !== "Idle"}
            <DeclaringInformation/>
        {/if}
    {:else}
        <DeclaringInformation/> 
    {/if}
</footer>
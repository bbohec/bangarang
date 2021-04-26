<script lang="ts">
    import DeclaringInformation from "../Notification/DeclaringInformation.svelte"
    import { declaringClaimUserNotificationStore } from "../../stores/declaringClaimStore";
    import NavigateBackToMainMenu from "../Destination/NavigateBackToMainMenu.svelte"
    
</script>
<footer class={"flex flex-col pt-2 pb-16 lg:pb-1 bg-bangarang-veryLightEmphasis"}>
    {#if $declaringClaimUserNotificationStore.status !== "Executing"}
        <section class={"flex w-full max-w-screen-md justify-between m-auto"}>
            <NavigateBackToMainMenu/>
        </section>
        {#if $declaringClaimUserNotificationStore.status !== "Idle"}
            <DeclaringInformation/>
        {/if}
    {:else}
        <DeclaringInformation/> 
    {/if}
</footer>
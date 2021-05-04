<script lang="ts">
    import DeclaringInformation from "../AppBarComponents/Notifications/DeclaringInformation.svelte"
    import { declaringClaimUserNotificationStore } from "../../stores/declaringClaimStore";
    import NavigateBackToMainMenu from "../AppBarComponents/Actions/NavigateBackToMainMenu.svelte"
</script>
<footer class={"flex flex-col pt-2 pb-16 lg:pb-1 bg-bangarang-veryLightEmphasis"}>
    <section class={"flex w-full max-w-screen-md justify-between md:justify-around lg:justify-evenly m-auto"}>
        {#if $declaringClaimUserNotificationStore.status !== "Executing"}
            <NavigateBackToMainMenu/>
            {#if $declaringClaimUserNotificationStore.status !== "Idle"}
                <DeclaringInformation/>
            {/if}
        {:else}
            <DeclaringInformation/> 
        {/if}
    </section>
</footer>
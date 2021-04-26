<script lang="ts">
    import RegisteringInformation from "../Notification/RegisteringInformation.svelte"
    import { registeringUserNotificationStore } from "../../stores/registeringStore";
    import NavigateToSignInMenu from "../Destination/NavigateToSignInMenu.svelte"
</script>
<footer class={"flex flex-col pt-2 pb-16 lg:pb-1 bg-bangarang-veryLightEmphasis"}>
    {#if $registeringUserNotificationStore.status !== "Executing"}
        <section class={"flex w-full max-w-screen-md justify-between m-auto"}>
            <NavigateToSignInMenu/>
        </section> 
        {#if $registeringUserNotificationStore.status !== "Idle"}
            <RegisteringInformation/>
        {/if}   
    {:else}
        <RegisteringInformation/>   
    {/if}
</footer>
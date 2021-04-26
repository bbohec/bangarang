<script lang="ts">
    import RegisteringInformation from "../Notification/RegisteringInformation.svelte"
    import { registeringUserNotificationStore } from "../../stores/registeringStore";
    import { appBarClass, footerClass } from "../Styles/componentStyles";
    import NavigateToSignInMenu from "../Destination/NavigateToSignInMenu.svelte"
</script>
<footer class={footerClass}>
    {#if $registeringUserNotificationStore.status !== "Executing"}
        <section class={appBarClass}>
            <NavigateToSignInMenu/>
        </section> 
        {#if $registeringUserNotificationStore.status !== "Idle"}
            <RegisteringInformation/>
        {/if}   
    {:else}
        <RegisteringInformation/>   
    {/if}
</footer>
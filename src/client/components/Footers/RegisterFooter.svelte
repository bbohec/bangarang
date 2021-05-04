<script lang="ts">
    import { registeringUserNotificationStore } from "../../stores/registeringStore";
    import RegisteringInformation from "../AppBarComponents/Notifications/RegisteringInformation.svelte"
    import NavigateToSignInMenu from "../AppBarComponents/Actions/NavigateToSignInMenu.svelte"
</script>
<footer class={"flex flex-col pt-2 pb-16 lg:pb-1 bg-bangarang-veryLightEmphasis"}>
    <section class={"flex w-full max-w-screen-md justify-between md:justify-around lg:justify-evenly m-auto"}>
        {#if $registeringUserNotificationStore.status !== "Executing"}
            <NavigateToSignInMenu/>
            {#if $registeringUserNotificationStore.status !== "Idle"}
                <RegisteringInformation/>
            {/if}   
        {:else}
            <RegisteringInformation/>   
        {/if}
    </section> 
</footer>
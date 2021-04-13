<script lang="ts">
    import Link from "../Links/Link.svelte";
    import RegisteringInformation from "../Notification/RegisteringInformation.svelte"
    import { StaticView } from "../../port/interactors/BangarangUserInterfaceInteractor";
    import { registeringUserNotificationStore } from "../../stores/registeringStore";
</script>
<footer class="flex flex-col p-1 mx-auto max-w-screen-2xl">
    {#if $registeringUserNotificationStore.status === "Executing"}
        <RegisteringInformation/>
    {:else}
        <section class="flex justify-between items-center">
            <Link size="small" linkName="<< Back to Sign In menu." linkHref={StaticView.SigningInMenu}/>
            <RegisteringInformation/>
        </section>        
    {/if}
</footer>
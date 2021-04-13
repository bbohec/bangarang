<script lang="ts">
    import Link from "../Links/Link.svelte"
    import {links} from "../../navigation/links"
    import DeclaringInformation from "../Notification/DeclaringInformation.svelte"
    import { declaringClaimUserNotificationStore } from "../../stores/declaringClaimStore";
</script>
<footer class="flex flex-col mb-1 mx-auto max-w-screen-2xl">
    {#if $declaringClaimUserNotificationStore.status === "Executing"}
        <DeclaringInformation/>
    {:else}
        <section class="flex justify-between items-center">
            <Link size="small" linkHref={links.MainMenu} linkName="<< Back to main menu." textAlign={"text-left"}/>
            <DeclaringInformation/>
        </section>        
    {/if}
</footer>
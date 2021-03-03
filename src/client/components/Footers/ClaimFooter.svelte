<script lang="ts">
    import {links} from "../../navigation/links"
    import {claimingStore} from "../../stores/claimingStore"
    import {declaringClaimStore} from "../../stores/declaringClaimStore"
    import Link from "../Links/Link.svelte"
    import ClaimShare from "../Links/ClaimShare.svelte"
    import ClaimingInformation from "../Notification/ClaimingInformation.svelte"
    import DeclaringInformation from "../Notification/DeclaringInformation.svelte";
</script>
<footer class="flex flex-col p-1 mx-auto max-w-screen-2xl">
    {#if $claimingStore.claimingStatus === "claiming"}
        <ClaimingInformation/>
    {:else if $declaringClaimStore.declaringClaimStatus === "declaringClaim"}
        <DeclaringInformation/>
    {:else}
        <ClaimShare/>
        <section class="flex justify-between items-center">
            <Link size="small" linkHref={links.MainMenu} linkName="<< Back to main menu." textAlign={"text-left"}/>
            {#if $claimingStore.claimingStatus === "claimed"}
                <ClaimingInformation/>
            {:else if $declaringClaimStore.declaringClaimStatus === "claimDeclared"}
                <DeclaringInformation/>
            {/if}
        </section>
    {/if}
</footer>
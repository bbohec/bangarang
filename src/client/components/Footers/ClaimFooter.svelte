<script lang="ts">
    import {links} from "../../routing/links"
    import {claimingStore} from "../../stores/claimingStore"
    import Link from "../Links/Link.svelte"
    import ClaimShare from "../Links/ClaimShare.svelte"
    import ClaimingInformation from "../Descriptions/ClaimingInformation.svelte"
</script>
<footer class="flex flex-col p-1 min-h-">
    {#if $claimingStore.claimingStatus === "claiming"}
        <ClaimingInformation/>
    {:else}
        <ClaimShare/>
        <section class="flex justify-between items-center">
            <Link size="small" linkHref={links.MainMenu} linkName="<< Back to main menu." textAlign={"text-left"}/>
            <ClaimingInformation/>
        </section>
    {/if}
</footer>
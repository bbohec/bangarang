<script lang="ts">
    import ClaimSearchBar from "../SearchBars/ClaimSearchBar.svelte"
    import SearchingClaimsInformation from "../Notification/SearchingClaimsInformation.svelte"
    import { searchingClaimsUserNotificationStore } from "../../stores/searchingClaimsStore";
    import ResetClaimSearch from "../Destination/ResetClaimSearch.svelte"
    import { appBarClass, footerClass } from "../Styles/componentStyles";
</script>
<footer class={footerClass}>
    <section class={appBarClass}>
        <ResetClaimSearch/>
        <ClaimSearchBar/>
    </section> 
    {#if $searchingClaimsUserNotificationStore.status !== "Idle"}
        <SearchingClaimsInformation/>
    {/if}
</footer>
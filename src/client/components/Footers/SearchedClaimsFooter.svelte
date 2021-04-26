<script lang="ts">
    import ClaimSearchBar from "../SearchBars/ClaimSearchBar.svelte"
    import SearchingClaimsInformation from "../Notification/SearchingClaimsInformation.svelte"
    import { searchingClaimsUserNotificationStore } from "../../stores/searchingClaimsStore";
    import ResetClaimSearch from "../Destination/ResetClaimSearch.svelte"
</script>
<footer class={"flex flex-col pt-2 pb-16 lg:pb-1 bg-bangarang-veryLightEmphasis"}>
    <section class={"flex w-full max-w-screen-md justify-between m-auto"}>
        <ResetClaimSearch/>
        <ClaimSearchBar/>
    </section> 
    {#if $searchingClaimsUserNotificationStore.status !== "Idle"}
        <SearchingClaimsInformation/>
    {/if}
</footer>
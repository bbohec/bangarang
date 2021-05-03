<script lang="ts">
    import ClaimSearchBar from "../SearchBars/ClaimSearchBar.svelte"
    import SearchingClaimsInformation from "../AppBarComponents/Notifications/SearchingClaimsInformation.svelte"
    import { searchingClaimsUserNotificationStore } from "../../stores/searchingClaimsStore";
    import ResetClaimSearch from "../AppBarComponents/Actions/ResetClaimSearch.svelte"
</script>
<footer class={"flex flex-col pt-2 pb-16 lg:pb-1 bg-bangarang-veryLightEmphasis"}>
    <section class={"flex w-full max-w-screen-md justify-between md:justify-around lg:justify-evenly m-auto"}>
        <ResetClaimSearch/>
        {#if $searchingClaimsUserNotificationStore.status !== "Idle"}
            <SearchingClaimsInformation/>
        {/if}
        <ClaimSearchBar/>
    </section> 
</footer>
<script lang="ts">
    import SearchedClaim from '../Cards/SearchedClaim.svelte'
    import {linkPrefixes} from "../../navigation/linkPrefixes"
    import type { ClaimContract } from '../../port/ClaimContract';
import { searchingClaimsUserNotificationStore } from '../../stores/searchingClaimsStore';
    let searchedClaims = new Array<ClaimContract>()
    searchingClaimsUserNotificationStore.subscribe(searchingClaimsUserNotification => {
        if (searchingClaimsUserNotification.status === "Success" && searchingClaimsUserNotification.retreivedClaims)
            searchedClaims = searchingClaimsUserNotification.retreivedClaims
    })
</script>
{#each searchedClaims as searchedClaim}
    <SearchedClaim title={searchedClaim.title} claimLink={"/"+linkPrefixes.claimLinkPrefix+searchedClaim.id}/>
{/each}
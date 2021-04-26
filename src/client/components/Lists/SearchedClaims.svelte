<script lang="ts">
    import SearchedClaim from '../Cards/SearchedClaim.svelte'
    import {linkPrefixes} from "../../navigation/linkPrefixes"
    import type { ClaimContract } from '../../port/ClaimContract';
    import { searchingClaimsUserNotificationStore } from '../../stores/searchingClaimsStore';
    import { languageStore } from '../../stores/languageStore';
    let searchedClaims = new Array<ClaimContract>()
    searchingClaimsUserNotificationStore.subscribe(searchingClaimsUserNotification => {
        if (searchingClaimsUserNotification.status === "Success" && searchingClaimsUserNotification.retreivedClaims)
            searchedClaims = searchingClaimsUserNotification.retreivedClaims
    })
</script>
{#each searchedClaims as searchedClaim}
    <SearchedClaim title={searchedClaim.title} claimLink={`/${$languageStore}/${linkPrefixes.claimLinkPrefix}${searchedClaim.id}`}/>
{/each}
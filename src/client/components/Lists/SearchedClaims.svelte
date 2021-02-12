<script lang="ts">
    import type { ClaimContract } from '../../interfaces/ClaimContract';
    import { retreiveClaimsByClaimSearchValue } from '../../logic/claim/retreiveClaimsByClaimSearchValue';
    import {claimSearchStore} from '../../stores/claimSearchStore'
    import SearchedClaim from '../Cards/SearchedClaim.svelte'
    import {claimLinkPrefix} from "../../routing/links"
    let searchedClaims = new Array<ClaimContract>()
    claimSearchStore.subscribe(claimSearchValue =>{searchedClaims= retreiveClaimsByClaimSearchValue(claimSearchValue)}) 
</script>
{#each searchedClaims as searchedClaim}
    <SearchedClaim title={searchedClaim.title} claimLink={"/"+claimLinkPrefix+searchedClaim.id}/>
{/each}
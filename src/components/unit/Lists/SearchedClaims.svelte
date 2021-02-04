<script lang="ts">
    import type { ClaimContract } from '../../interfaces/ClaimContract';
    import { retreiveClaimsByClaimSearchValue } from '../../logic/retreiveClaimsByClaimSearchValue';
    import {claimSearchStore} from '../../stores/claimSearchStore'
    import SearchedClaim from '../../../components/unit/Cards/SearchedClaim.svelte'
    let searchedClaims = new Array<ClaimContract>()
    claimSearchStore.subscribe(claimSearchValue =>{searchedClaims= retreiveClaimsByClaimSearchValue(claimSearchValue)}) 
</script>
{#each searchedClaims as searchedClaim}
    <SearchedClaim title={searchedClaim.title}/>
{/each}
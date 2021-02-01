<script lang="ts">
    import type { ClaimContract } from '../../interfaces/ClaimContract';
    import { retreiveClaimsByClaimSearchValue } from '../../logic/src/ui/logic/retreiveClaimsByClaimSearchValue';
    import {claimSearchStore} from '../../stores/claimSearchStore'
    let searchedClaims = new Array<ClaimContract>()
    claimSearchStore.subscribe(claimSearchValue =>{searchedClaims= retreiveClaimsByClaimSearchValue(claimSearchValue)}) 
</script>
{#each searchedClaims as searchedClaim}
    <p class="border">{searchedClaim.title}</p>
{/each}
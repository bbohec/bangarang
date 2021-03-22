<script lang="ts">
    import { afterUpdate } from "svelte";
    import { searchingClaims } from "../../logic/claim/retreiveClaimsByClaimSearchValue";
    import {claimSearchCriteriaStore} from "../../stores/claimSearchStore"
    let searchBar:{focus():void};
    afterUpdate(()=> {
        if ($claimSearchCriteriaStore.length === 1) {
            searchBar.focus()
            searchingClaims($claimSearchCriteriaStore)
        }
    })
</script>
<input 
    class="text-xl text-center my-1 px-1 pb-1 text-bangarang-dark placeholder-bangarang-darkEmphasis border-bangarang-lightEmphasis border rounded-md" 
    type="text" 
    placeholder="Find a claim..." 
    bind:value={$claimSearchCriteriaStore} 
    bind:this={searchBar}
>
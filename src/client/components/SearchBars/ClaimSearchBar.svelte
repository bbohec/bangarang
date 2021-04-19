<script lang="ts">
    import { afterUpdate } from "svelte";
    import { Message } from "../../logic/language";
    import { claimSearchBarPlaceholderMessage } from "../../logic/messages";
    import { searchingClaims } from "../../logic/retreiveClaimsByClaimSearchValue";
    import {claimSearchCriteriaStore} from "../../stores/claimSearchStore"
    import { languageStore } from "../../stores/languageStore";
    let searchBar:{focus():void};
    let previousSearchCriteria = ""
    afterUpdate(()=> {if($claimSearchCriteriaStore.length === 1) searchBar.focus()})
    let timer:number 
    const waitBeforeSearchingClaims=1000;
    const debounce = (currentSearchCriteria:string):void => {
        clearTimeout(timer); 
        timer = setTimeout(() => shouldExecuteSearchingClaims(currentSearchCriteria), waitBeforeSearchingClaims);
    }
    claimSearchCriteriaStore.subscribe(searchCriteria => debounce(searchCriteria))
    function shouldExecuteSearchingClaims(currentSearchCriteria: string) {
        if(currentSearchCriteria!==previousSearchCriteria) {
            previousSearchCriteria=currentSearchCriteria;
            searchingClaims(previousSearchCriteria);
        }
    }
</script>
<input 
    class="text-xl text-center my-1 px-1 pb-1 text-bangarang-dark placeholder-bangarang-darkEmphasis border-bangarang-lightEmphasis border rounded-md" 
    type="text" 
    placeholder={new Message(claimSearchBarPlaceholderMessage).getMessage($languageStore)} 
    bind:value={$claimSearchCriteriaStore} 
    bind:this={searchBar}
>
<script lang="ts">
    import { afterUpdate } from "svelte";
    import {claimSearchStore} from "../../stores/claimSearchStore"
    let searchBar:{focus():void};
    afterUpdate(()=> {if ($claimSearchStore.length === 1) searchBar.focus()})
</script>
<input 
    class="text-xl text-center my-1 px-1 pb-1 text-bangarang-dark placeholder-bangarang-darkEmphasis border-bangarang-lightEmphasis border rounded-md" 
    type="text" 
    placeholder="Find a claim..." 
    bind:value={$claimSearchStore} 
    bind:this={searchBar}
>
<script lang="ts">
    import { afterUpdate } from "svelte";
    export let claimSearch:string;
    export let searchBar;
    afterUpdate(()=> {if (claimSearch.length >= 1) searchBar.focus()})
</script>
<input class="text-xl text-center mx-5 my-1 text-gray-600 border-gray-100 border rounded " type="text" placeholder="Find a claim..." bind:value={claimSearch} bind:this={searchBar}>
<script lang="ts">
    import ClaimSearchBar from '../../components/SearchBars/ClaimSearchBar.svelte'
    import BackToMainMenuLink from '../../components/Links/BackToMainMenuLink.svelte'
    import {claimSearchStore} from '../../stores/claimSearchStore'
</script>
<div class="row-span-5 grid content-end">
    TODO
    <p>{$claimSearchStore}</p>
</div>
<div class="row-span-1 grid content-end">
    <ClaimSearchBar/>
    <BackToMainMenuLink/>
</div>
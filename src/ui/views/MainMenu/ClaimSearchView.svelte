<script lang="ts">
    import ClaimSearchBar from '../../components/SearchBars/ClaimSearchBar.svelte'
    import BackToMainMenuLink from '../../components/Links/BackToMainMenuLink.svelte'
    import SearchedClaims from '../../components/Lists/SearchedClaims.svelte'
</script>
<div class="row-span-5 grid content-end">
    <SearchedClaims/>
</div>
<div class="row-span-1 grid content-end">
    <ClaimSearchBar/>
    <BackToMainMenuLink/>
</div>
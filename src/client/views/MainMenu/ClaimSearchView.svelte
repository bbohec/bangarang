<script lang="ts">
    import ClaimSearchBar from '../../components/SearchBars/ClaimSearchBar.svelte'
    import BackToMainMenuLink from '../../components/Links/BackToMainMenuLink.svelte'
    import SearchedClaims from '../../components/Lists/SearchedClaims.svelte'
</script>
<main class="flex-grow overflow-y-auto">
    <SearchedClaims/>
</main>
<footer class="flex flex-col mb-1">
    <ClaimSearchBar/>
    <BackToMainMenuLink/>
</footer>
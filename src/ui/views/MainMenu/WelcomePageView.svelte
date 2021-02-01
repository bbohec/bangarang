<script lang="ts">
    import DeclareNewClaimButton from '../../components/Buttons/DeclareNewClaimButton.svelte'
    import LinkToBangarangLeanCanvas from '../../components/Links/LinkToBangarangLeanCanvas.svelte'
    import WelcomeTitle from '../../components/Titles/WelcomeTitle.svelte'
    import BangarangDescription from '../../components/Descriptions/BangarangDescription.svelte'
    import ClaimSearchBar from '../../components/SearchBars/ClaimSearchBar.svelte'
</script>
<main class="flex-grow overflow-y-auto">
    <WelcomeTitle/>
    <BangarangDescription/>
</main>
<footer class="row-span-1 grid content-evenly">
    <ClaimSearchBar/>
    <DeclareNewClaimButton/>
    <LinkToBangarangLeanCanvas/>
</footer>
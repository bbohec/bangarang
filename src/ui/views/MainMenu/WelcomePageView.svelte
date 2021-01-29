<script lang="ts">
    import DeclareNewClaimButton from '../../components/Buttons/DeclareNewClaimButton.svelte'
    import LinkToBangarangLeanCanvas from '../../components/Links/LinkToBangarangLeanCanvas.svelte'
    import WelcomeTitle from '../../components/Titles/WelcomeTitle.svelte'
    import BangarangDescription from '../../components/Descriptions/BangarangDescription.svelte'
    import ClaimSearchBar from '../../components/SearchBars/ClaimSearchBar.svelte'
</script>
<div class="row-span-5 grid content-center">
    <WelcomeTitle/>
    <BangarangDescription/>
</div>
<div class="row-span-1 grid content-evenly">
    <ClaimSearchBar/>
    <DeclareNewClaimButton/>
    <LinkToBangarangLeanCanvas/>
</div>
<script lang="ts">
    import DeclareNewClaimButton from '../../components/Buttons/DeclareNewClaimButton.svelte'
    import {links} from "../../routing/links"
    import Link from '../../components/Links/Link.svelte'
    import WelcomeTitle from '../../components/Titles/WelcomeTitle.svelte'
    import BangarangDescription from '../../components/Descriptions/BangarangDescription.svelte'
    import ClaimSearchBar from '../../components/SearchBars/ClaimSearchBar.svelte'
    import PreviewCard from '../../components/Cards/PreviewCard.svelte'
</script>
<main class="flex-grow overflow-y-auto flex flex-col items-center justify-center">
    <WelcomeTitle/>
    <BangarangDescription/>
    <PreviewCard/>
</main>
<footer class="flex flex-col mb-1">
    <ClaimSearchBar/>
    <DeclareNewClaimButton/>
    <Link size="small" linkName="What is Bangarang?" linkHref={links.businessModel}/>
</footer>
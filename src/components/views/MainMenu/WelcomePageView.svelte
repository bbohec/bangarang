<script lang="ts">
    import DeclareNewClaimButton from '../../../components/unit/Buttons/DeclareNewClaimButton.svelte'
    import {links} from "../../../components/routing/links"
    import Link from '../../../components/unit/Links/Link.svelte'
    import WelcomeTitle from '../../../components/unit/Titles/WelcomeTitle.svelte'
    import BangarangDescription from '../../../components/unit/Descriptions/BangarangDescription.svelte'
    import ClaimSearchBar from '../../../components/unit/SearchBars/ClaimSearchBar.svelte'
</script>
<main class="flex-grow overflow-y-auto flex flex-col items-center justify-center">
    <WelcomeTitle/>
    <BangarangDescription/>
</main>
<footer class="flex flex-col mb-1">
    <ClaimSearchBar/>
    <DeclareNewClaimButton/>
    <Link size="small" linkName="What is Bangarang?" linkHref={links.businessModel}/>
</footer>
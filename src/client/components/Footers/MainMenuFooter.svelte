<script lang="ts">
    import { goto } from '@sapper/app';
    import ClaimSearchBar from "../SearchBars/ClaimSearchBar.svelte"
    import GenericButton from "../Buttons/GenericButton.svelte"
    import Link from "../Links/Link.svelte"
    import { links } from "../../navigation/links";
    const declareClaimTextButton = `Declare new claim`
    const navigateToUrl = ():void => goto(links.DeclareClaim)
</script>
<footer class="flex flex-col mb-1 mx-auto max-w-screen-2xl">
    <ClaimSearchBar/>
    <GenericButton textbutton={declareClaimTextButton} onClickAction={navigateToUrl}/>
    <Link size="small" linkName="What is Bangarang?" linkHref={links.BusinessModel}/>
</footer>
<script lang="ts">
    import ClaimSearchBar from "../SearchBars/ClaimSearchBar.svelte"
    import { appBarClass, footerClass } from '../Styles/componentStyles';
    import NavigateToDeclareClaim from '../Destination/NavigateToDeclareClaim.svelte'
    import NavigateToBusinessModel from '../Destination/NavigateToBusinessModel.svelte'
    
</script>
<footer class={`${footerClass} `}>
    <section class={appBarClass}>
        <NavigateToBusinessModel/>
        <ClaimSearchBar/>
        <NavigateToDeclareClaim/>
    </section>
</footer>
<script lang="ts">
    import ClaimSearchBar from "../SearchBars/ClaimSearchBar.svelte"
    import NavigateToDeclareClaim from '../Destination/NavigateToDeclareClaim.svelte'
    import NavigateToBusinessModel from '../Destination/NavigateToBusinessModel.svelte'
</script>
<footer class={`${"flex flex-col pt-2 pb-16 lg:pb-1 bg-bangarang-veryLightEmphasis"} `}>
    <section class={"flex w-full max-w-screen-md justify-between m-auto"}>
        <NavigateToBusinessModel/>
        <ClaimSearchBar/>
        <NavigateToDeclareClaim/>
    </section>
</footer>
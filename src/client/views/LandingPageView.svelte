<script lang="ts">
    import LandingPageMain from "../components/Mains/LandingPageMain.svelte";
    export let mainHeadLine:string|undefined
    export let supportingHeadLine:string|undefined
</script>
<LandingPageMain {mainHeadLine} {supportingHeadLine}/>
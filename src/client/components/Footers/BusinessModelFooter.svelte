<script lang="ts">
    import NavigateBackToMainMenu from "../Destination/NavigateBackToMainMenu.svelte"
    import NagivateToLeanCanvas from "../Destination/NavigateToLeanCanvas.svelte"
    import { appBarClass, footerClass } from "../Styles/componentStyles";
</script>
<footer class={footerClass}>
    <section class={appBarClass}>
        <NavigateBackToMainMenu/>
        <NagivateToLeanCanvas/>
    </section>
</footer>
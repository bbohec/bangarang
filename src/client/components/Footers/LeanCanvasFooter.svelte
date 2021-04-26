<script lang="ts">
    import { appBarClass, footerClass } from "../Styles/componentStyles";
    import NavigateToBusinessModel from "../Destination/NavigateToBusinessModel.svelte"
    import NavigateToMainMenu from "../Destination/NavigateToMainMenu.svelte"
</script>
<footer class={footerClass}>
    <section class={appBarClass}>
        <NavigateToBusinessModel/>
        <NavigateToMainMenu/>
    </section>
</footer>
<script lang="ts">
    import NavigateToLeanCanvas from "../AppBarComponents/Actions/NavigateToLeanCanvas.svelte"
    import NavigateToMainMenu from "../AppBarComponents/Actions/NavigateToMainMenu.svelte"
</script>
<footer class={"flex flex-col pt-2 pb-16 lg:pb-1 bg-bangarang-veryLightEmphasis"}>
    <section class={"flex w-full max-w-screen-md justify-between md:justify-around lg:justify-evenly m-auto"}>
        <NavigateToLeanCanvas/>
        <NavigateToMainMenu/>
    </section>
</footer>
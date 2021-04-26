<script lang="ts">
    import WelcomeTitle from "../Titles/WelcomeTitle.svelte"
    import BangarangDescription from "../Descriptions/BangarangDescription.svelte"
    import DemoPreviewCard from "../Cards/DemoPreviewCard.svelte"
    import { mainClass } from "../Styles/componentStyles";
</script>
<main class={mainClass}>
    <WelcomeTitle/>
    <BangarangDescription/>
    <DemoPreviewCard/>
</main>
<script lang="ts">
    import Link from "../components/Links/Link.svelte"
    import { links } from "../routing/links";
    import ViewTitle from "../components/Titles/ViewTitle.svelte"
</script>
<header class="flex flex-col">
    <ViewTitle title="SYNDICALIST EARLY ADOPTER"/>
</header>
<main class="flex-grow overflow-y-auto">

</main>
<footer class="flex flex-col">
    <Link size="small" linkName="The Lean Canvas" linkHref={links.leanCanvas}/>
    <Link size="small" linkName="Use Bangarang!" linkHref={links.mainMenu}/>
</footer>
<script lang="ts">
    import Link from "../components/unit/Links/Link.svelte"
    import { links } from "../components/routing/links"
    import ViewTitle from "../components/unit/Titles/ViewTitle.svelte"
</script>
<header class="flex flex-col">
    <ViewTitle title="ACTIVIST EARLY ADOPTER"/>
</header>
<main class="flex-grow overflow-y-auto">

</main>
<footer class="flex flex-col">
    <Link size="small" linkName="The Lean Canvas" linkHref={links.leanCanvas}/>
    <Link size="small" linkName="Use Bangarang!" linkHref={links.mainMenu}/>
</footer>
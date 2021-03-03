<script lang="ts">
    import Link from "../Links/Link.svelte"
    import { links } from "../../navigation/links";
</script>
<footer class="flex flex-col mb-1">
    <Link size="small" linkName="The Lean Canvas" linkHref={links.LeanCanvas}/>
    <Link  size="small" linkName="Use Bangarang!" linkHref={links.MainMenu}/>
</footer>
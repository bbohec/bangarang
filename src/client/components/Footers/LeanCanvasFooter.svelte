<script lang="ts">
    import Link from "../Links/Link.svelte"
    import {links} from "../../navigation/links"
</script>
<footer class="flex flex-col">
    <Link size="small" linkName="The Business Model" linkHref={links.BusinessModel}/>
    <Link size="small" linkName="Use Bangarang!" linkHref={links.MainMenu}/>
</footer>
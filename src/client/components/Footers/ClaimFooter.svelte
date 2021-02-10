<script lang="ts">
    import Link from "../Links/Link.svelte"
    import {links} from "../../routing/links"
    import ClaimShare from "../Links/ClaimShare.svelte"
</script>
<footer class="flex flex-col p-1">
    <ClaimShare/>
    <Link size="small" linkHref={links.MainMenu} linkName="<< Back to main menu." textAlign={"text-left"}/>
</footer>
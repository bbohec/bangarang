<script lang="ts">
    import Link from "../Links/Link.svelte"
    import {links} from "../../navigation/links"
</script>
<footer class="flex flex-col mb-1">
    <Link size="small" linkHref={links.MainMenu} linkName="<< Back to main menu." textAlign={"text-left"}/>
</footer>
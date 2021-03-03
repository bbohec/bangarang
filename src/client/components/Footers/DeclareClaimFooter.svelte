<script lang="ts">
    import Link from "../Links/Link.svelte"
    import {links} from "../../navigation/links"
</script>
<footer class="flex flex-col mb-1 mx-auto max-w-screen-2xl">
    <Link size="small" linkHref={links.MainMenu} linkName="<< Back to main menu." textAlign={"text-left"}/>
</footer>
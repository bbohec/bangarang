<script lang="ts">
    import Link from "../Links/Link.svelte"
    import {links} from "../../routing/links"
</script>
<footer class="flex flex-col">
    <p class="text-center underline text-sm text-bangarang-darkEmphasis">Would you like to share this claim?</p>
    <Link size="small" linkHref={links.mainMenu} linkName="Back to main menu." textAlign={"text-left"}/>
</footer>
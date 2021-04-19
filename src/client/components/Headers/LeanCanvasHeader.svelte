<script lang="ts">
    import { Message } from "../../logic/language";
    import { leanCanvasTitleMessage } from "../../logic/messages";
    import { languageStore } from "../../stores/languageStore";
    import HeaderTitle from "../Titles/HeaderTitle.svelte"
</script>
<header class="flex flex-col">
    <HeaderTitle title={new Message(leanCanvasTitleMessage).getMessage($languageStore)}/>
</header>
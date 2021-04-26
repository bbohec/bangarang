<script lang="ts">
    import { Message } from "../../logic/language";
    import { leanCanvasTitleMessage } from "../../logic/messages";
    import { languageStore } from "../../stores/languageStore";
    import { headerCenteredClass } from "../Styles/componentStyles";
    import HeaderTitle from "../Titles/HeaderTitle.svelte"
</script>
<header class={headerCenteredClass}>
    <HeaderTitle 
        title={new Message(leanCanvasTitleMessage).getMessage($languageStore)}
    />
</header>
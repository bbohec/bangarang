<script lang="ts">
    import { Message } from "../../logic/language";
    import { bangarangBusinessModelTitleMessage } from "../../logic/messages";
    import { languageStore } from "../../stores/languageStore";
    import HeaderTitle from "../Titles/HeaderTitle.svelte"
</script>
<header class="flex flex-col">
    <HeaderTitle 
        title={new Message(bangarangBusinessModelTitleMessage).getMessage($languageStore)}
    />
</header>
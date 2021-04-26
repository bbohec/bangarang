<script lang="ts">
    import { Message } from "../../logic/language";
    import { bangarangBusinessModelTitleMessage } from "../../logic/messages";
    import { languageStore } from "../../stores/languageStore";
    import HeaderTitle from "../Titles/HeaderTitle.svelte"
</script>
<header class={"flex flex-col flex-grow mx-auto px-1 justify-center items-center max-w-screen-md"}>
    <HeaderTitle 
        title={new Message(bangarangBusinessModelTitleMessage).getMessage($languageStore)}
    />
</header>
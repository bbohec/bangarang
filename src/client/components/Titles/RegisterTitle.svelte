<script lang="ts">
    import { Message } from "../../logic/language";
    import { bangarang, registerOnBangarangTitleMessage } from "../../logic/messages";
    import { languageStore } from "../../stores/languageStore";
</script>
<p class="text-2xl text-bangarang-darkEmphasis my-1">{new Message(registerOnBangarangTitleMessage).getMessage($languageStore)}</p>
<h1 class="text-4xl text-bangarang-darkEmphasis my-1">{new Message(bangarang).getMessage($languageStore)}</h1>
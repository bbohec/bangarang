<script lang="ts">
    import { Message } from "../../logic/language";
    import { bangarangDescriptionMessage } from "../../logic/messages";
    import { languageStore } from "../../stores/languageStore";
</script>
<p class="text-sm text-center text-bangarang-lightEmphasis my-1">{new Message(bangarangDescriptionMessage).getMessage($languageStore)}</p>
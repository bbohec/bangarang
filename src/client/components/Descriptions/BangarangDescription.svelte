<script lang="ts">
    import { Message } from "../../logic/language";
    import { bangarangDescriptionMessage } from "../../logic/messages";
    import { languageStore } from "../../stores/languageStore";
</script>
<p class="text-center m-2 text-bangarang-lightEmphasis">{new Message(bangarangDescriptionMessage).getMessage($languageStore)}</p>
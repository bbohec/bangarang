<script lang="ts">
    import type { MessageContract } from "../../logic/language";
    import { Message } from "../../logic/language";
    import { languageStore } from "../../stores/languageStore";
    export let message:MessageContract
</script>
<h1 class="text-center my-1 text-2xl text-bangarang-darkEmphasis">{new Message(message).getMessage($languageStore)}</h1>
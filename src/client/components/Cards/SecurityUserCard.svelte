<script lang="ts">
    import { Message } from "../../logic/language";
    import { registerSecurityMessage } from "../../logic/messages";
    import { languageStore } from "../../stores/languageStore";
    const message:string= new Message(registerSecurityMessage).getMessage($languageStore)
</script>
<div class="border rounded my-6 border-bangarang-failed bg-bangarang-light flex flex-col items-center">
    <p class="m-1 text-bangarang-lightEmphasis flex-grow text-center text-xs">{@html message}</p>
</div>
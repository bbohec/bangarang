<script lang="ts">
    import { Message } from "../../logic/language";
    import { registerSecurityMessage } from "../../logic/messages";
    import { languageStore } from "../../stores/languageStore";
    const message:string= new Message(registerSecurityMessage).getMessage($languageStore)
</script>
<div class="shadow-lg rounded-lg m-3 p-3 bg-bangarang-veryLightEmphasis text-bangarang-lightEmphasis flex flex-col items-center">
    <p class="text-center text-xs">{@html message}</p>
</div>
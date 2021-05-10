<script lang="ts">
    import { Message } from "../../logic/language";
    import { bangarangContactFormMessage, demoWarningMessage } from "../../logic/messages";
    import { languageStore } from "../../stores/languageStore";
    const googleFormUrl:string="https://forms.gle/H7FWYyG4HcHYthy99"
</script>
<div class="shadow-lg rounded-lg m-3 p-3 bg-bangarang-veryLightEmphasis text-bangarang-lightEmphasis flex flex-col items-center">
    <p class="text-center text-xs">{@html new Message(demoWarningMessage).getMessage($languageStore)}</p>
    <a href={googleFormUrl} target="_blank" class="text-sm underline text-bangarang-dark">{new Message(bangarangContactFormMessage).getMessage($languageStore)}</a>
</div>
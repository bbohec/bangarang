<script lang="ts">
    import { Message } from "../../logic/language";
    import { bangarangContactFormMessage, demoWarningMessage } from "../../logic/messages";
    import { languageStore } from "../../stores/languageStore";
    const googleFormUrl:string="https://forms.gle/H7FWYyG4HcHYthy99"
</script>
<div class="border rounded my-6 border-bangarang-failed bg-bangarang-light flex flex-col items-center">
    <p class="m-1 text-bangarang-lightEmphasis flex-grow text-center text-xs">{@html new Message(demoWarningMessage).getMessage($languageStore)}</p>
    <a href={googleFormUrl} target="_blank" class=" m-1 underline text-bangarang-darkEmphasis text-sm">{new Message(bangarangContactFormMessage).getMessage($languageStore)}</a>
</div>
<script lang="ts">
    import { Message } from "../../logic/language";
    import { signInFormTitleMessage } from "../../logic/messages";
    import { languageStore } from "../../stores/languageStore";
    import SignInForm from "../Form/SignInForm.svelte"
</script>
<p class="text-bangarang-lightEmphasis">{new Message(signInFormTitleMessage).getMessage($languageStore)}</p>
<SignInForm/>
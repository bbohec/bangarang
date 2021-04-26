<script lang="ts">
    import { Message } from "../../logic/language"
    import { registerFormTitleMessage } from "../../logic/messages";
    import { languageStore } from "../../stores/languageStore";
    import SecurityUserCard from "../Cards/SecurityUserCard.svelte"
    import RegisterForm from "../Form/RegisterForm.svelte"
</script>
<SecurityUserCard/>
<p class="text-bangarang-lightEmphasis">{new Message(registerFormTitleMessage).getMessage($languageStore) }</p>
<RegisterForm/>
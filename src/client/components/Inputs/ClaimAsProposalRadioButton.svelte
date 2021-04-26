<script lang="ts">
    import { Message } from "../../logic/language";
    import { simpleClaimTypeMessage } from "../../logic/messages";
    import { languageStore } from "../../stores/languageStore";
</script>
<input 
    id="claimType"      
    type="radio" 
    name="claimType" 
    checked
>
<label 
    for="claimType" 
    class="text-bangarang-lightEmphasis"
>{new Message(simpleClaimTypeMessage).getMessage($languageStore)}</label>
<script lang="ts">
    import { Message } from "../../logic/language";
    import { signOutMessage } from "../../logic/messages";
    import { currentUserContractStore } from "../../stores/currentUserContract";
    import { languageStore } from "../../stores/languageStore";
    import SignInSection from "../Sections/SignInSection.svelte"
    import { mainClass } from "../Styles/componentStyles";
</script>
<main class={mainClass}>
    {#if $currentUserContractStore === undefined}    
        <SignInSection/>
    {:else}
        <p class="invisible">{new Message(signOutMessage).getMessage($languageStore)}</p>
    {/if}     
</main>

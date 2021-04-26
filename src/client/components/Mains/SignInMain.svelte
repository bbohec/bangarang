<script lang="ts">
    import { Message } from "../../logic/language";
    import { signOutMessage } from "../../logic/messages";
    import { currentUserContractStore } from "../../stores/currentUserContract";
    import { languageStore } from "../../stores/languageStore";
    import SignInSection from "../Sections/SignInSection.svelte"
</script>
<main class={"flex flex-col flex-grow m-auto p-1 justify-center items-center max-w-screen-md"}>
    {#if $currentUserContractStore === undefined}    
        <SignInSection/>
    {:else}
        <p class="invisible">{new Message(signOutMessage).getMessage($languageStore)}</p>
    {/if}     
</main>

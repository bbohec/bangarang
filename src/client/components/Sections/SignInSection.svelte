<script lang="ts">
    import { signingIn } from "../../logic/singIn";
    import GenericButton from "../Buttons/GenericButton.svelte"
    import {signingInNotificationStore} from "../../stores/signInStore"
    let userInputUsername="";
    let userInputPassword="";
    const onClickSignInButton = ():void => signingIn(userInputUsername,userInputPassword)
</script>
<p class="text-bangarang-lightEmphasis">Sign into your account</p>
{#if $signingInNotificationStore.status === "Executing"}
    <input 
        class="text-xl text-center mx-5 my-1 text-bangarang-dark placeholder-bangarang-darkEmphasis border-bangarang-lightEmphasis border rounded-md" 
        type="text" 
        placeholder="Username ..."
        readonly
        bind:value={userInputUsername} 
    >
    <input 
        class="text-xl text-center mx-5 my-1 text-bangarang-dark placeholder-bangarang-darkEmphasis border-bangarang-lightEmphasis border rounded-md" 
        type="password" 
        placeholder="Password ..." 
        readonly
        bind:value={userInputPassword} 
    >
    <GenericButton textbutton="Sign in" onClickAction={onClickSignInButton} disabled={true}/>
{:else}
    <input 
        class="text-xl text-center mx-5 my-1 text-bangarang-dark placeholder-bangarang-darkEmphasis border-bangarang-lightEmphasis border rounded-md" 
        type="text" 
        placeholder="Username ..."
        bind:value={userInputUsername} 
    >
    <input 
        class="text-xl text-center mx-5 my-1 text-bangarang-dark placeholder-bangarang-darkEmphasis border-bangarang-lightEmphasis border rounded-md" 
        type="password" 
        placeholder="Password ..." 
        bind:value={userInputPassword} 
    >
    {#if userInputUsername !== "" && userInputPassword !== ""}
        <GenericButton textbutton="Sign in" onClickAction={onClickSignInButton} />
        <p class="text-bangarang-darkEmphasis invisible">Forgot password?</p>
    {/if}
{/if}



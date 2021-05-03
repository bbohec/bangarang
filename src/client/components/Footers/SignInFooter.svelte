<script lang="ts">
    import SignInInformation from "../AppBarComponents/Notifications/SignInInformation.svelte"
    import {currentClaimIdStore} from "../../stores/currentClaimIdStore"
    import {signingInNotificationStore} from "../../stores/signInStore"
    import NavigateToRegisterMenu from "../AppBarComponents/Actions/NavigateToRegisterMenu.svelte"
    import NavigateToMainMenu from '../AppBarComponents/Actions/NavigateToMainMenu.svelte'
    import NavigateToCurrentClaim from '../AppBarComponents/Actions/NavigateToCurrentClaim.svelte'
</script>
<footer class={"flex flex-col pt-2 pb-16 lg:pb-1 bg-bangarang-veryLightEmphasis"}>
        <section class={"flex w-full max-w-screen-md justify-between md:justify-around lg:justify-evenly m-auto"}>
            {#if $signingInNotificationStore.status !== "Executing"}
                {#if $currentClaimIdStore === undefined}
                    <NavigateToMainMenu/>
                {:else}
                    <NavigateToCurrentClaim currentClaimId={$currentClaimIdStore}/>
                {/if} 
                {#if $signingInNotificationStore.status !== "Idle"}
                    <SignInInformation/>
                {/if}   
                <NavigateToRegisterMenu/>
            {:else}
                <SignInInformation/> 
            {/if}   
        </section> 
</footer>
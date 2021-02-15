<script lang="ts">
    import Link from "../Links/Link.svelte";
    import SignInInformation from "../Descriptions/SignInInformation.svelte"
    import {claimLinkPrefix, links} from "../../routing/links"
    import {currentClaimIdStore} from "../../stores/currentClaimIdStore"
    import {signInStore} from "../../stores/signInStore"
    let currentClaimId:string|undefined=undefined;
    currentClaimIdStore.subscribe(currentClaimIdFromStore =>currentClaimId=currentClaimIdFromStore)
    const linkFromCurrentClaimId = (currentClaimId:string):{href:string,name:string} => {
        if(currentClaimId===undefined)return {href:links.MainMenu,name:"<< Back to main menu."}
        return {href:claimLinkPrefix+currentClaimId,name:"<< Back to the claim."}
    }
</script>
<footer class="flex flex-col p-1 min-h-">
    {#if $signInStore.signInStatus === "signing in"}
        <SignInInformation/>
    {:else}
        <section class="flex justify-center items-center">
            <!-- <Link size="small" linkHref={links.MainMenu} linkName="Would you like to register on Bangarang?" textAlign={"text-center"}/>-->
        </section>
        <section class="flex justify-between items-center">
            <Link size="small" linkHref={linkFromCurrentClaimId(currentClaimId).href} linkName={linkFromCurrentClaimId(currentClaimId).name} textAlign={"text-left"}/>
            <SignInInformation/>
        </section>
    {/if}
</footer>
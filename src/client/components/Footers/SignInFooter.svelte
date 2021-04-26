<script lang="ts">
    import Link from "../Links/Link.svelte";
    import SignInInformation from "../Notification/SignInInformation.svelte"
    import {currentClaimIdStore} from "../../stores/currentClaimIdStore"
    import {signingInNotificationStore} from "../../stores/signInStore"
    import { linkPrefixes } from "../../navigation/linkPrefixes";
    import { StaticView } from "../../port/interactors/BangarangUserInterfaceInteractor";
import { languageStore } from "../../stores/languageStore";
import { backToMainMenuLinkMessage, backToTheClaimMessage, signInRegisterMessage } from "../../logic/messages";
import { Message } from "../../logic/language";
import { footerClass } from "../Styles/componentStyles";
    let currentClaimId:string|undefined=undefined;
    currentClaimIdStore.subscribe(currentClaimIdFromStore =>currentClaimId=currentClaimIdFromStore)
    const linkFromCurrentClaimId = (currentClaimId:string|undefined):{href:string,name:string} => {
        return (currentClaimId===undefined)? 
            {href:`/${$languageStore}/${StaticView.MainMenu}`,name:new Message(backToMainMenuLinkMessage).getMessage($languageStore)}:
            {href:`/${$languageStore}/${linkPrefixes.claimLinkPrefix}${currentClaimId}`,name:new Message(backToTheClaimMessage).getMessage($languageStore)}
    }
</script>
<footer class={footerClass}>
    {#if $signingInNotificationStore.status === "Executing"}
        <SignInInformation/>
    {:else}
        <section class="flex justify-center items-center">
            <Link size="small" linkHref={`/${$languageStore}/${StaticView.Register}`} linkName={new Message(signInRegisterMessage).getMessage($languageStore)} textAlign={"text-center"}/>
        </section>
        <section class="flex justify-between items-center">
            <Link size="small" linkHref={linkFromCurrentClaimId(currentClaimId).href} linkName={linkFromCurrentClaimId(currentClaimId).name} textAlign={"text-left"}/>
            {#if $signingInNotificationStore.status !== "Idle"}
                <SignInInformation/>
            {/if}
        </section>
    {/if}
</footer>
<script lang="ts">
    import { Message } from "../../logic/language";
    import { faqLinkNameMessage, useBangarangLinkMessage } from "../../logic/messages";
    import { StaticView } from "../../port/interactors/BangarangUserInterfaceInteractor";
    import { languageStore } from "../../stores/languageStore";
    import Link from "../Links/Link.svelte"
</script>
<footer class="flex flex-col">
    <Link 
        linkName={new Message(faqLinkNameMessage).getMessage($languageStore)} 
        linkHref={`/${$languageStore}/${StaticView.BusinessModel}`}
        size="small"
    />
    <Link 
        linkName={new Message(useBangarangLinkMessage).getMessage($languageStore)} 
        linkHref={`/${$languageStore}/${StaticView.MainMenu}`}
        size="small" 
    />
</footer>
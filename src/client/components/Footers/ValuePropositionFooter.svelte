<script lang="ts">
    import { Message } from '../../logic/language';
    import { leanCanvasLinkMessage, useBangarangLinkMessage } from '../../logic/messages';
    import { StaticView } from '../../port/interactors/BangarangUserInterfaceInteractor';
    import { languageStore } from '../../stores/languageStore';
    import Link from '../Links/Link.svelte'
</script>
<footer class={"flex flex-col pt-2 pb-16 lg:pb-1 bg-bangarang-veryLightEmphasis"}>
    <Link 
        linkName={new Message(leanCanvasLinkMessage).getMessage($languageStore)} 
        linkHref={`/${$languageStore}/${StaticView.LeanCanvas}`}
        size="small"
    />
    <Link 
        linkName={new Message(useBangarangLinkMessage).getMessage($languageStore)} 
        linkHref={`/${$languageStore}/${StaticView.MainMenu}`}
        size="small" 
    />
</footer>
<script lang="ts">
    import type { DescriptionCardContract } from "../../interfaces/DescriptionCardContract";
    import { Message } from "../../logic/language";
    import { definitionOfBangarangMessages, whatIsBangarangMessages, whyThisNameMessages } from "../../logic/messages";
    import { languageStore } from "../../stores/languageStore";
    import DescriptionCard from "../Cards/DescriptionCard.svelte"
    const BusinessModelValues:Array<DescriptionCardContract> = [
        {
            title:new Message(whatIsBangarangMessages.title).getMessage($languageStore),
            description:new Message(whatIsBangarangMessages.description).getMessage($languageStore),
            bulletPoints:whatIsBangarangMessages.bulletPoints.map(bulletPoint => new Message(bulletPoint).getMessage($languageStore))
        },
        {
            title:new Message(definitionOfBangarangMessages.title).getMessage($languageStore),
            description:new Message(definitionOfBangarangMessages.description).getMessage($languageStore),
            bulletPoints:definitionOfBangarangMessages.bulletPoints.map(bulletPoint => new Message(bulletPoint).getMessage($languageStore))
        },
        {
            title:new Message(whyThisNameMessages.title).getMessage($languageStore),
            description:new Message(whyThisNameMessages.description).getMessage($languageStore),
            bulletPoints:whyThisNameMessages.bulletPoints.map(bulletPoint => new Message(bulletPoint).getMessage($languageStore))
        }
    ];
</script>
<main class={"flex flex-col flex-grow m-auto p-1 items-center max-w-screen-md overflow-y-auto"}>
    {#each BusinessModelValues as businessModelValue }
        <DescriptionCard descriptionCardContract={businessModelValue}/>
    {/each}
</main>
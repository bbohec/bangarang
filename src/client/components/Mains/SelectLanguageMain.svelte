<script lang="ts">
    import type {SelectLanguage}from "../../logic/language"
    import {SUPPORTED_LANGUAGES} from "../../logic/language"
    import Link from "../Links/Link.svelte"
    export let selectLanguages:SelectLanguage
</script>
<main class={"flex flex-col flex-grow m-auto p-1 justify-center items-center max-w-screen-md"}>
    {#each SUPPORTED_LANGUAGES as supportedLanguage}
        <Link 
            linkName={selectLanguages[supportedLanguage].languageText} 
            linkHref={selectLanguages[supportedLanguage].linkToMainMenuWithLanguage}
            size="medium"
        />
    {/each}
</main>
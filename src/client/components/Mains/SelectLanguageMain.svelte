<script lang="ts">
    import type {SelectLanguage}from "../../logic/language"
    import {SUPPORTED_LANGUAGES} from "../../logic/language"
    import Link from "../Links/Link.svelte"
import { mainClass } from "../Styles/componentStyles";
    export let selectLanguages:SelectLanguage
</script>
<main class={mainClass}>
    {#each SUPPORTED_LANGUAGES as supportedLanguage}
        <Link 
            linkName={selectLanguages[supportedLanguage].languageText} 
            linkHref={selectLanguages[supportedLanguage].linkToMainMenuWithLanguage}
            size="medium"
        />
    {/each}
</main>
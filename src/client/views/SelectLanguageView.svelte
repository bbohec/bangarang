<script lang="ts">
    import { SUPPORTED_LANGUAGES } from "../logic/language";
    import SelectLanguageHeader from "../components/Headers/SelectLanguageHeader.svelte"
    import SelectLanguageMain from "../components/Mains/SelectLanguageMain.svelte"
    import { selectLanguages } from "../logic/messages";
    let currentIndex = 0
    let currentSelectYourLanguageMessage = selectLanguages[SUPPORTED_LANGUAGES[currentIndex]].selectYourLanguageMessage
    setInterval(()=>{
        currentIndex++
        if(currentIndex === SUPPORTED_LANGUAGES.length) currentIndex = 0
        currentSelectYourLanguageMessage = selectLanguages[SUPPORTED_LANGUAGES[currentIndex]].selectYourLanguageMessage
    },2000)
</script>
<SelectLanguageHeader {currentSelectYourLanguageMessage}/>
<SelectLanguageMain {selectLanguages}/>
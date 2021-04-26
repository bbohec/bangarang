<script lang="ts">
    import { headerCenteredClass } from "../Styles/componentStyles";
    import MainTitle from "../Titles/MainTitle.svelte"
    export let currentSelectYourLanguageMessage:string
</script>
<header class={headerCenteredClass}>
    <MainTitle
        title={currentSelectYourLanguageMessage}
        position="center"
        size="large"
    />
</header>

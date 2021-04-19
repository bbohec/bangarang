<script lang="ts">
    import MainTitle from "../Titles/MainTitle.svelte"
    export let currentSelectYourLanguageMessage:string
</script>
<header class="flex flex-col flex-grow items-center justify-end">
    <MainTitle
        title={currentSelectYourLanguageMessage}
        position="center"
        size="large"
    />
</header>

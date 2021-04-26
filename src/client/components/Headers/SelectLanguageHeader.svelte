<script lang="ts">
    
    import MainTitle from "../Titles/MainTitle.svelte"
    export let currentSelectYourLanguageMessage:string
</script>
<header class={"flex flex-col flex-grow mx-auto px-1 justify-center items-center max-w-screen-md"}>
    <MainTitle
        title={currentSelectYourLanguageMessage}
        position="center"
        size="large"
    />
</header>

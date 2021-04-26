<script lang="ts">
    import { currentUserContractStore } from "../../stores/currentUserContract";
    import WelcomeTitle from "../Titles/WelcomeTitle.svelte"
</script>
<header class={"flex flex-col flex-grow mx-auto px-1 justify-end items-center max-w-screen-md"}>
    <WelcomeTitle/>
    {#if $currentUserContractStore !== undefined}
        <h2 class="text-2xl text-bangarang-darkEmphasis my-1">{$currentUserContractStore.username}</h2>
    {/if}
</header>
<script lang="ts">
    import WelcomeTitle from "../Titles/WelcomeTitle.svelte"
    import {connectedUserStore} from "../../stores/connectedUserStore"
</script>
<header class="flex flex-col flex-grow justify-center items-center content-center">
    <WelcomeTitle/>
    {#if $connectedUserStore !== null}
        <h2 class="text-2xl text-bangarang-darkEmphasis my-1">{$connectedUserStore.username}</h2>
    {/if}
</header>
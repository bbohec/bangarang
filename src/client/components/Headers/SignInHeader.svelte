<script lang="ts">
import { uiBangarangUserBuilder } from "../../adapters/uiPrimaryAdapter";
    import WelcomeTitle from "../Titles/WelcomeTitle.svelte"
    const user = uiBangarangUserBuilder.getUser()
</script>
<header class="flex flex-col flex-grow justify-center items-center content-center mx-auto max-w-screen-2xl">
    <WelcomeTitle/>
    {#if user.username !== ""}
        <h2 class="text-2xl text-bangarang-darkEmphasis my-1">{user.username}</h2>
    {/if}
</header>
<script lang="ts">
    import { uiBangarangUserBuilder } from "../../adapters/uiPrimaryAdapter";
    import SignInSection from "../Sections/SignInSection.svelte"
    const user = uiBangarangUserBuilder.getUser()
</script>
{#if user.username === "guest"}
    <main class="flex flex-col flex-grow items-center">
        <SignInSection/>
    </main>
{:else}
    <main class="flex flex-col items-center my-10 mx-auto max-w-screen-2xl">
        <p class="invisible">SignOut</p>
    </main>
{/if}
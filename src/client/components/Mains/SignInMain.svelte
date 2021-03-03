<script lang="ts">
    import SignInSection from "../Sections/SignInSection.svelte"
    import {connectedUserStore} from "../../stores/connectedUserStore"
</script>
{#if $connectedUserStore === null}
    <main class="flex flex-col flex-grow items-center">
        <SignInSection/>
    </main>
{:else}
    <main class="flex flex-col items-center my-10 mx-auto max-w-screen-2xl">
        <p class="invisible">SignOut</p>
    </main>
{/if}

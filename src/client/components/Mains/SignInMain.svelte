<script lang="ts">
    import { currentUserContractStore } from "../../stores/currentUserContract";
    import SignInSection from "../Sections/SignInSection.svelte"
</script>
{#if $currentUserContractStore === undefined}
    <main class="flex flex-col flex-grow justify-center items-center">
        <SignInSection/>
    </main>
{:else}
    <main class="flex flex-col flex-grow justify-center items-center">
        <p class="invisible">SignOut</p>
    </main>
{/if}
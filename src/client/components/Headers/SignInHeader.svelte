<script lang="ts">
    import { currentUserContractStore } from "../../stores/currentUserContract";
    import { headerEndClass } from "../Styles/componentStyles";
    import WelcomeTitle from "../Titles/WelcomeTitle.svelte"
</script>
<header class={headerEndClass}>
    <WelcomeTitle/>
    {#if $currentUserContractStore !== undefined}
        <h2 class="text-2xl text-bangarang-darkEmphasis my-1">{$currentUserContractStore.username}</h2>
    {/if}
</header>
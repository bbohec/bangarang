<script lang="ts">
    import type { DescriptionCardContract } from "../../interfaces/DescriptionCardContract";
    import Link from "../Links/Link.svelte"
    export let descriptionCardContract:DescriptionCardContract
</script>
<section class="mb-2 p-1 border-bangarang-lightEmphasis border rounded shadow">
    <h2 class="text-bangarang-dark text-center">{descriptionCardContract.title}</h2>
    <p class="text-bangarang-darkEmphasis text-center font-light italic text-sm">{descriptionCardContract.description}</p>
    {#if descriptionCardContract.bulletPoints !== undefined && descriptionCardContract.bulletPoints.length > 1}
        <ul class="list-disc list-inside">
            {#each descriptionCardContract.bulletPoints as bulletPoint }
                <li class="text-bangarang-darkEmphasis text-sm">{bulletPoint}</li>
            {/each}
        </ul>  
    {:else if descriptionCardContract.bulletPoints !== undefined && descriptionCardContract.bulletPoints.length === 1}
    <p class="text-bangarang-darkEmphasis text-sm text-center">{descriptionCardContract.bulletPoints[0]}</p>
    {/if}
    {#if descriptionCardContract.links !== undefined && descriptionCardContract.links.length > 0}
        {#each descriptionCardContract.links as link}
            <p class="text-center"><Link linkHref={link.href} linkName={link.name} size="small" /></p>
        {/each}
    {/if}
</section>
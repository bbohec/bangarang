<script lang="ts">
    import type { DescriptionCardContract } from "../../interfaces/DescriptionCardContract";
    import Link from "../Links/Link.svelte"
    export let descriptionCardContract:DescriptionCardContract
</script>
<section class="mb-2 p-1">
    <h2 class="text-bangarang-dark text-center font-semibold">{descriptionCardContract.title}</h2>
    <p class="text-bangarang-darkEmphasis text-center text-sm">{descriptionCardContract.description}</p>
    {#if descriptionCardContract.bulletPoints?.length > 0}
        <ul class="list-disc list-inside">
            {#each descriptionCardContract.bulletPoints as bulletPoint }
                <li class="text-bangarang-darkEmphasis text-sm">{bulletPoint}</li>
            {/each}
        </ul>  
    {/if}
    {#if descriptionCardContract.links?.length > 0}
        {#each descriptionCardContract.links as link}
            <span>
                <Link linkHref={link.href} linkName={link.name} size="medium" />
            </span>
        {/each}
    {/if}
</section>
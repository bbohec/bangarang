<script context="module">
	export async function preload(page, session) {
		const { slug } = page.params;

		const res = await this.fetch(`blog/${slug}.json`);
		const article = await res.json();

		return { article };
	}
</script>
<script lang="ts">
    import MainTitle from "../../client/components/Titles/MainTitle.svelte"
    import MainSubTitle from "../../client/components/Titles/MainSubTitle.svelte"
    import GenericButton from "../../client/components/Buttons/GenericButton.svelte"
    import {links} from "../../client/routing/links"
    export let mainHeadLine:string|undefined
    export let supportingHeadline:string|undefined
    const theme:"light"|"dark"="dark"
</script>
<main class="flex-grow overflow-y-auto flex flex-col items-center justify-evenly bg-bangarang-dark">
    <section>
        {#if mainHeadLine}
        <MainTitle title={mainHeadLine} size="large" {theme}/>
        {/if}
        {#if supportingHeadline}
            <MainSubTitle title={`Use Bangarang and ${supportingHeadline.toLocaleLowerCase()}`} {theme}/>
        {/if}
    </section>
    <GenericButton textbutton="Get started" customClasses="w-11/12" size="large" color="dark" />
</main>
<script lang="ts">
	import Tailwindcss from '../components/Styles/tailwindcss.svelte';
	import WelcomeTitle from '../components/Titles/WelcomeTitle.svelte'
	import BangarangDescription from '../components/Descriptions/BangarangDescription.svelte'
	import ClaimSearchBar from '../components/SearchBars/ClaimSearchBar.svelte'
	import DeclareNewClaimButton from '../components/Buttons/DeclareNewClaimButton.svelte'
	import LinkToBangarangLeanCanvas from '../components/Links/LinkToBangarangLeanCanvas.svelte'
	import Back from '../components/Icons/back.svelte'
	let claimSearch = ''
	const resetClaimSearch = () => claimSearch = ''
</script>
<style>
</style>
<Tailwindcss />
<main class="text-center p-1 min-w-screen min-h-screen grid grid-cols-1 items-stretch grid-rows-6 text-black bg-white">
	{#if claimSearch === ''}
		<div class="row-span-5 grid content-center">
			<WelcomeTitle/>
			<BangarangDescription/>
		</div>
		<div class="row-span-1 grid content-evenly">
			<ClaimSearchBar bind:claimSearch/>
			<DeclareNewClaimButton/>
			<LinkToBangarangLeanCanvas/>
		</div>
	{:else}
		<div class="row-span-5 grid content-end">
			TODO
		</div>
		<div class="row-span-1 grid content-end">
			<ClaimSearchBar bind:claimSearch/>
			<p>{claimSearch}</p>
			<span on:click={resetClaimSearch}><Back/><p class="text-xs underline"> TODO Return to main menu</p></span>
		</div>
	{/if}
</main>
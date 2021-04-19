<script context="module" lang="ts">
	export async function preload(page:any, session:any) {
        const {language} = page.params;
		const selectedLanguage:string = language
		return {selectedLanguage}
	}
</script>
<script lang="ts">
	import MainMenu from './MainMenu.svelte'
	export let selectedLanguage:string
</script>
<MainMenu {selectedLanguage}/>
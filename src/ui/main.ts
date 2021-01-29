import MainMenu from './views/MainMenu.svelte';
const app = new MainMenu({
	target: document.body,
	props: {
		name: 'world'
	}
});
export default app;
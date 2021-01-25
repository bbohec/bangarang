import Main from './components/main.svelte';
const app = new Main({
	target: document.body,
	props: {
		name: 'world'
	}
});
export default app;
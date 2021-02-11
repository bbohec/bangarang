//import MainMenu from './pages/MainMenu.svelte';
import Router from './routing/Router.svelte'
const app = new Router({
	target: document.body,
	props: {},
	hydrate:true
});
export default app;
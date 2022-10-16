<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import DrawerContent from '$lib/components/DrawerContent.svelte';
	import Map from '$lib/components/Map.svelte';
	import { selectedStyle } from '$lib/stores';
	import { config } from '../config';

	let drawerOpen = false;

	const defaultStyle = config.styles[0];
	selectedStyle.update(() => defaultStyle);
</script>

<sveltekit:head>
	<title>{config.title}</title>
	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css"
		integrity="sha512-xh6O/CkQoPOWDdYTDqeRdPCVd1SpvCA9XXcUnZS2FmJNp1coAFzvtCN9BmamE+4aHK8yyUHUSCcJHgXloTyT2A=="
		crossorigin="anonymous"
		referrerpolicy="no-referrer"
	/>
</sveltekit:head>

<Header bind:drawerOpen />
<DrawerContent bind:open={drawerOpen}>
	<Map />
</DrawerContent>

<style>
	@import 'bulma/css/bulma.css';
</style>

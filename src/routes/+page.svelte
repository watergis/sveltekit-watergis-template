<script lang="ts">
	import Header from '../components/Header.svelte';
	import DrawerContent from '../components/DrawerContent.svelte';
	import Map from '../components/Map.svelte';
	import { selectedStyle } from '../stores';
	import { config } from '../config';

	let drawerOpen = false;

	const defaultStyle = config.styles[0];
	selectedStyle.update(() => defaultStyle);
</script>

<sveltekit:head>
	<title>{config.title}</title>
</sveltekit:head>

<Header bind:drawerOpen />
<DrawerContent bind:open={drawerOpen}>
	<Map />
</DrawerContent>

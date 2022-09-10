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
</sveltekit:head>

<Header bind:drawerOpen />
<DrawerContent bind:open={drawerOpen}>
	<Map />
</DrawerContent>

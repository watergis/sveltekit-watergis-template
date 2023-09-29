<script lang="ts">
	import { config } from '$config';
	import Map from '$lib/components/Map.svelte';
	import { selectedStyle } from '$lib/stores';
	import { onMount } from 'svelte';

	const defaultStyle = config.styles[0];
	selectedStyle.update(() => defaultStyle);

	onMount(async () => {
		window.global = window;
		const Buffer = await (await import('buffer')).Buffer;
		window.Buffer = Buffer;
	});
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
		integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA=="
		crossorigin="anonymous"
		referrerpolicy="no-referrer"
	/>
</svelte:head>

<Map />

<style global lang="scss">
	@import 'bulma/bulma.sass';
</style>

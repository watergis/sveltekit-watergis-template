<script lang="ts">
	import { config } from '$config';
	import Map from '$lib/components/Map.svelte';
	import { selectedStyle } from '$lib/stores';

	const defaultStyle = config.styles[0];
	selectedStyle.update(() => defaultStyle);
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
	@import 'bulma/css/bulma.min.css';
</style>

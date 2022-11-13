<script lang="ts">
	import Map from '$lib/components/Map.svelte';
	import { selectedStyle } from '$lib/stores';
	import { config } from '$config';

	const defaultStyle = config.styles[0];
	selectedStyle.update(() => defaultStyle);
</script>

<sveltekit:head>
	<title>{config.title}</title>
</sveltekit:head>

<Map />

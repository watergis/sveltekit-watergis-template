<script lang="ts">
	import Map from '$lib/components/Map.svelte';
	import { selectedStyle } from '$lib/stores';
	import { config } from '$config';
	import Metatag from '$lib/components/Metatag.svelte';

	const defaultStyle = config.styles[0];
	selectedStyle.update(() => defaultStyle);
</script>

<Metatag
	bind:title={config.title}
	bind:description={config.description}
	bind:site_url={config.site_url}
	bind:preview={config.preview}
/>

<Map />

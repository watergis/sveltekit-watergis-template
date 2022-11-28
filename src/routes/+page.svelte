<script lang="ts">
	import Map from '$lib/components/Map.svelte';
	import { selectedStyle } from '$lib/stores';
	import { config } from '$config';

	const defaultStyle = config.styles[0];
	selectedStyle.update(() => defaultStyle);
</script>

<svelte:head>
	<!-- Primary Meta Tags -->
	<title>{config.title}</title>
	<meta name="title" content={config.title} />
	<meta name="description" content={config.description} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={config.site_url} />
	<meta property="og:title" content={config.title} />
	<meta property="og:description" content={config.description} />
	<meta property="og:image" content={config.preview} />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={config.site_url} />
	<meta property="twitter:title" content={config.title} />
	<meta property="twitter:description" content={config.description} />
	<meta property="twitter:image" content={config.preview} />
</svelte:head>

<Map />

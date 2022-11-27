<script lang="ts">
	import Map from '$lib/components/Map.svelte';
	import { selectedStyle } from '$lib/stores';
	import { config } from '$config';

	const defaultStyle = config.styles[0];
	selectedStyle.update(() => defaultStyle);
</script>

<sveltekit:head>
	<meta property="og:title" content={config.title} />
	<meta name="description" content={config.description} />
	<meta property="og:site_name" content={config.title} />
	<meta property="og:url" content={config.siteUrl} />
	<meta name="twitter:card" content="app" />
	<meta name="twitter:site" content={config.twitterAccount} />
	<title>{config.title}</title>
</sveltekit:head>

<Map />

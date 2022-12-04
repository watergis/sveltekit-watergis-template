<script lang="ts">
	import Map from '$lib/components/Map.svelte';
	import { selectedStyle } from '$lib/stores';
	import { config } from '$config';
	import { onMount } from 'svelte';

	const defaultStyle = config.styles[0];
	selectedStyle.update(() => defaultStyle);

	onMount(async () => {
		window.global = window;
		const Buffer = await (await import('buffer')).Buffer;
		window.Buffer = Buffer;
	});
</script>

<Map />

<script lang="ts">
	import { MeasurePanel } from '@watergis/svelte-maplibre-measure';
	import CollapsiblePanel from './CollapsiblePanel.svelte';
	import { ValhallaIsochronePanel, ValhallaRoutingPanel } from '@watergis/svelte-maplibre-valhalla';
	import { map } from '$lib/stores';
	import { config } from '$config';

	export let isAdvancedTabVisible = false;

	let panelMeasureOpen = true;
	let panelRoutingOpen = true;
	let panelTimeIsochroneOpen = false;
</script>

<div class="panel-content">
	{#if isAdvancedTabVisible}
		{#if config.elevation}
			<CollapsiblePanel title="Measuring tool" bind:isPanelOpen={panelMeasureOpen}>
				<MeasurePanel
					bind:map={$map}
					bind:measureOption={config.elevation.options}
					bind:terrainRgbUrl={config.elevation.url}
				/>
			</CollapsiblePanel>
		{/if}
		{#if config.valhalla}
			<CollapsiblePanel title="Routing tool" bind:isPanelOpen={panelRoutingOpen}>
				<ValhallaRoutingPanel
					bind:map={$map}
					bind:url={config.valhalla.url}
					bind:options={config.valhalla.routingOptions}
				/>
			</CollapsiblePanel>
			<CollapsiblePanel title="Isochrone analysis" bind:isPanelOpen={panelTimeIsochroneOpen}>
				<ValhallaIsochronePanel
					bind:map={$map}
					bind:url={config.valhalla.url}
					bind:options={config.valhalla.isoChroneOptions}
				/>
			</CollapsiblePanel>
		{/if}
	{/if}
</div>

<style lang="scss">
	$height: calc(100vh - 40px);

	.panel-content {
		overflow-y: auto;
		height: $height;
	}
</style>

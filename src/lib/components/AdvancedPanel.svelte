<script lang="ts">
	import { MeasurePanel } from '@watergis/svelte-maplibre-measure';
	import { ValhallaIsochronePanel, ValhallaRoutingPanel } from '@watergis/svelte-maplibre-valhalla';
	import { CollapsiblePanel } from '@watergis/svelte-collapsible-panel';
	import { map } from '$lib/stores';
	import { config } from '$config';

	export let isAdvancedTabVisible = false;
	let panelColor:
		| ''
		| 'is-link'
		| 'is-primary'
		| 'is-info'
		| 'is-success'
		| 'is-warning'
		| 'is-danger' = 'is-link';
	let expandedPanel: 'measure' | 'routing' | 'isochrone' = 'measure';

	let panelMeasureOpen = false;
	let panelRoutingOpen = false;
	let panelTimeIsochroneOpen = false;

	$: if (panelMeasureOpen) {
		expandedPanel = 'measure';
	}
	$: if (panelRoutingOpen) {
		expandedPanel = 'routing';
	}
	$: if (panelTimeIsochroneOpen) {
		expandedPanel = 'isochrone';
	}

	$: expandedPanel, initialisePanels();
	const initialisePanels = () => {
		switch (expandedPanel) {
			case 'measure':
				panelMeasureOpen = true;
				panelRoutingOpen = false;
				panelTimeIsochroneOpen = false;
				break;
			case 'routing':
				panelMeasureOpen = false;
				panelRoutingOpen = true;
				panelTimeIsochroneOpen = false;
				break;
			case 'isochrone':
				panelMeasureOpen = false;
				panelRoutingOpen = false;
				panelTimeIsochroneOpen = true;
				break;
			default:
				break;
		}
	};
</script>

<div class="panel-content">
	{#if isAdvancedTabVisible}
		{#if config.elevation}
			<CollapsiblePanel
				title="Measuring tool"
				bind:isPanelOpen={panelMeasureOpen}
				color={panelColor}
			>
				<div class="accordion-content">
					<MeasurePanel
						bind:map={$map}
						bind:measureOption={config.elevation.options}
						bind:terrainRgbUrl={config.elevation.url}
					/>
				</div>
			</CollapsiblePanel>
		{/if}
		{#if config.valhalla}
			<CollapsiblePanel title="Routing tool" bind:isPanelOpen={panelRoutingOpen} color={panelColor}>
				<div class="accordion-content">
					<ValhallaRoutingPanel
						bind:map={$map}
						bind:url={config.valhalla.url}
						bind:options={config.valhalla.routingOptions}
					/>
				</div>
			</CollapsiblePanel>
			<CollapsiblePanel
				title="Isochrone analysis"
				bind:isPanelOpen={panelTimeIsochroneOpen}
				color={panelColor}
			>
				<div class="accordion-content">
					<ValhallaIsochronePanel
						bind:map={$map}
						bind:url={config.valhalla.url}
						bind:options={config.valhalla.isoChroneOptions}
					/>
				</div>
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

	.accordion-content {
		padding-top: 0.5rem;
		padding-left: 0.5rem;
		padding-right: 0.5rem;
		padding-bottom: 0.5rem;
	}
</style>

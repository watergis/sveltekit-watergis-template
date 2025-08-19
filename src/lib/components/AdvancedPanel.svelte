<script lang="ts">
	import { map } from '$lib/stores';
	import { CollapsiblePanel } from '@watergis/svelte-collapsible-panel';
	import { ValhallaIsochronePanel, ValhallaRoutingPanel } from '@watergis/svelte-maplibre-valhalla';
	import { getContext, untrack } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { config as defaultConfig } from '../../config';

	const config = $state(defaultConfig);

	let windowHeight: number = $state();
	let tabHeight: Writable<number> = getContext('tab-height');

	let panelColor:
		| ''
		| 'is-link'
		| 'is-primary'
		| 'is-info'
		| 'is-success'
		| 'is-warning'
		| 'is-danger' = 'is-link';
	let expandedPanel: 'measure' | 'routing' | 'isochrone' = $state('measure');

	let panelMeasureOpen = $state(false);
	let panelRoutingOpen = $state(false);
	let panelTimeIsochroneOpen = $state(false);

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
	let contentHeight = $derived(windowHeight - $tabHeight - 20);
	$effect(() => {
		if (panelMeasureOpen) {
			expandedPanel = 'measure';
		}
	});
	$effect(() => {
		if (panelRoutingOpen) {
			expandedPanel = 'routing';
		}
	});
	$effect(() => {
		if (panelTimeIsochroneOpen) {
			expandedPanel = 'isochrone';
		}
	});
	$effect(() => {
		if (expandedPanel) {
			untrack(() => {
				initialisePanels();
			});
		}
	});
</script>

<svelte:window bind:innerHeight={windowHeight} />

<div class="panel-content" style="height:{contentHeight}px;">
	{#if config.valhalla}
		<CollapsiblePanel title="Routing tool" bind:isPanelOpen={panelRoutingOpen} color={panelColor}>
			<div class="accordion-content">
				<ValhallaRoutingPanel
					bind:map={$map}
					url={config.valhalla.url}
					options={config.valhalla.routingOptions}
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
					url={config.valhalla.url}
					options={config.valhalla.isoChroneOptions}
				/>
			</div>
		</CollapsiblePanel>
	{/if}
</div>

<style lang="scss">
	.panel-content {
		overflow-y: auto;
	}

	.accordion-content {
		padding-top: 0.5rem;
		padding-left: 0.5rem;
		padding-right: 0.5rem;
		padding-bottom: 0.5rem;
	}
</style>

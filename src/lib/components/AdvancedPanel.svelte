<script lang="ts">
	import MeasurePanel from './MeasurePanel.svelte';
	import ValhallaIsochronePanel from './ValhallaIsochronePanel.svelte';
	import ValhallaRoutingPanel from './ValhallaRoutingPanel.svelte';
	import CollapsiblePanel from './CollapsiblePanel.svelte';
	import { config } from '$config';

	export let isAdvancedTabVisible = false;

	let panelMeasureOpen = true;
	let panelRoutingOpen = true;
	let panelTimeIsochroneOpen = false;
</script>

{#if isAdvancedTabVisible}
	{#if config.elevation}
		<CollapsiblePanel title="Measuring tool" bind:isPanelOpen={panelMeasureOpen}>
			<MeasurePanel />
		</CollapsiblePanel>
	{/if}
	{#if config.valhalla}
		<CollapsiblePanel title="Routing tool" bind:isPanelOpen={panelRoutingOpen}>
			<ValhallaRoutingPanel />
		</CollapsiblePanel>
		<CollapsiblePanel title="Isochrone analysis" bind:isPanelOpen={panelTimeIsochroneOpen}>
			<ValhallaIsochronePanel />
		</CollapsiblePanel>
	{/if}
{/if}

<script lang="ts">
	import { map, selectedStyle } from '$lib/stores';
	import { config } from '$config';
	import { LegendPanel, LegendHeader } from '@watergis/svelte-maplibre-legend';
	import { StyleSwitcher } from '@watergis/svelte-maplibre-style-switcher';
	import type { StyleSpecification } from 'maplibre-gl';

	let style: StyleSpecification = undefined;
	$: {
		if ($map) {
			$map.on('load', () => {
				style = $map.getStyle();
			});
		}
	}

	let onlyRendered = true;
	let onlyRelative = true;
	let relativeLayers = {};
	export let isLayersTabVisible = false;

	if (config.legend && config.legend.targets) {
		relativeLayers = config.legend.targets;
	}

	const onStyleChange = () => {
		if (!$map) return;
		style = $map.getStyle();
	};
</script>

{#if isLayersTabVisible}
	<div class="primary-container">
		<div class="style-header">
			<StyleSwitcher
				bind:map={$map}
				bind:selectedStyle={$selectedStyle}
				bind:styles={config.styles}
				on:change={onStyleChange}
			/>
		</div>
		<div class="legend-header m-1">
			<LegendHeader bind:onlyRendered bind:onlyRelative />
		</div>
		<div class="legend-content">
			<LegendPanel bind:map={$map} {style} bind:onlyRendered bind:onlyRelative {relativeLayers} />
		</div>
	</div>
{/if}

<style lang="scss">
	$height: calc(100vh - 140px);

	.primary-container {
		display: flex;
		flex-direction: column;
		position: relative;
		margin: 0.5rem;

		.style-header {
			width: 100%;
			margin-bottom: 0.5rem;
		}

		.legend-header {
			width: 100%;
			margin-bottom: 0.5rem;
		}

		.legend-content {
			overflow-x: hidden;
			overflow-y: auto;
			height: $height;
			width: 100%;
		}
	}
</style>

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
	<nav class="panel">
		<div class="panel-header m-1 p-0">
			<StyleSwitcher
				bind:map={$map}
				bind:selectedStyle={$selectedStyle}
				bind:styles={config.styles}
				on:change={onStyleChange}
			/>
		</div>
		<div class="legend-header m-1">
			<LegendHeader bind:onlyRendered bind:onlyRelative {relativeLayers} />
		</div>
		<div class="legend-content">
			<LegendPanel bind:map={$map} {style} bind:onlyRendered bind:onlyRelative {relativeLayers} />
		</div>
	</nav>
{/if}

<style lang="scss">
	$height: calc(100vh - 135px);

	.legend-content {
		position: absolute;
		overflow-x: hidden;
		overflow-y: auto;
		height: $height;
		width: 100%;
	}
</style>

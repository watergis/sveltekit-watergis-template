<script lang="ts">
	import type { StyleSpecification, LayerSpecification } from 'maplibre-gl';
	import Layer from './Layer.svelte';
	import StyleSwitcher from './StyleSwitcher.svelte';
	import { map } from '$lib/stores';
	import { config } from '../../config';

	let style: StyleSpecification = undefined;
	let onlyRendered = true;
	let onlyRelative = true;

	let allLayers: LayerSpecification[] = [];
	let visibleLayerMap = {};
	let relativeLayers = {};
	export let isLayersTabVisible = false;

	if (config.legend && config.legend.targets) {
		relativeLayers = config.legend.targets;
	}

	$: {
		if ($map) {
			$map.on('moveend', updateLayers);
			$map.on('styledata', updateLayers);
		}
	}

	$: style, updateLayers();
	$: onlyRendered, updateLayers();
	$: onlyRelative, updateLayers();

	export const updateLayers = () => {
		if (!$map) return;
		if (!$map.isStyleLoaded()) return;
		style = $map.getStyle();
		allLayers = style.layers;
		setTimeout(() => {
			updateVisibleLayers();
		}, 500);
	};

	const updateVisibleLayers = () => {
		visibleLayerMap = {};
		if ($map && $map.queryRenderedFeatures) {
			const features = $map.queryRenderedFeatures();
			for (let feature of features) {
				visibleLayerMap[feature.layer.id] = feature.layer;
			}
		}
	};

	const onStyleChange = () => {
		updateLayers();
	};
</script>

{#if isLayersTabVisible}
	<nav class="panel">
		<div class="panel-block">
			<StyleSwitcher on:change={onStyleChange} />
		</div>
		<div class="panel-block">
			<label class="checkbox">
				<input type="checkbox" bind:checked={onlyRendered} />
				Show only rendered layers
			</label>
		</div>
		<div class="panel-block">
			<label class="checkbox">
				<input type="checkbox" bind:checked={onlyRelative} />
				Show only water layers
			</label>
		</div>

		{#key style}
			{#each allLayers as layer}
				{#if onlyRendered === true}
					{#if visibleLayerMap[layer.id]}
						{#if onlyRelative === true}
							{#if relativeLayers[layer.id]}
								<!-- svelte-ignore a11y-missing-attribute -->
								<a class="panel-block"><Layer {layer} /></a>
							{/if}
						{:else}
							<!-- svelte-ignore a11y-missing-attribute -->
							<a class="panel-block"><Layer {layer} /></a>
						{/if}
					{/if}
				{:else if onlyRelative === true}
					{#if relativeLayers[layer.id]}
						<!-- svelte-ignore a11y-missing-attribute -->
						<a class="panel-block"><Layer {layer} /></a>
					{/if}
				{:else}
					<!-- svelte-ignore a11y-missing-attribute -->
					<a class="panel-block"><Layer {layer} /></a>
				{/if}
			{/each}
		{/key}
	</nav>
{/if}

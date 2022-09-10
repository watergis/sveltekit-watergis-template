<script lang="ts">
	import { Content, Header } from '@smui/drawer';
	import List, { Item } from '@smui/list';
	import FormField from '@smui/form-field';
	import Checkbox from '@smui/checkbox';
	import type { StyleSpecification, LayerSpecification } from 'maplibre-gl';
	import Layer from './Layer.svelte';
	import StyleSwitcher from './StyleSwitcher.svelte';
	import { map } from '$lib/stores';
	import { config } from '../config';

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
	<Header>
		<StyleSwitcher on:change={onStyleChange} />
		<hr />
		<FormField>
			<Checkbox bind:checked={onlyRendered} />
			<span slot="label">Show only rendered layers</span>
		</FormField>
		<FormField>
			<Checkbox bind:checked={onlyRelative} />
			<span slot="label">Show only water layers</span>
		</FormField>
		<hr />
	</Header>
	<Content>
		<List>
			{#key style}
				{#each allLayers as layer}
					{#if onlyRendered === true}
						{#if visibleLayerMap[layer.id]}
							{#if onlyRelative === true}
								{#if relativeLayers[layer.id]}
									<Item><Layer {layer} /></Item>
								{/if}
							{:else}
								<Item><Layer {layer} /></Item>
							{/if}
						{/if}
					{:else if onlyRelative === true}
						{#if relativeLayers[layer.id]}
							<Item><Layer {layer} /></Item>
						{/if}
					{:else}
						<Item><Layer {layer} /></Item>
					{/if}
				{/each}
			{/key}
		</List>
	</Content>
{/if}

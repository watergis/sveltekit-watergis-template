<script lang="ts">
	import { Content, Header } from '@smui/drawer';
	import List, { Item } from '@smui/list';
	import FormField from '@smui/form-field';
	import Checkbox from '@smui/checkbox';
	import type { StyleSpecification, LayerSpecification } from 'maplibre-gl';
	import Layer from './Layer.svelte';
	import StyleSwitcher from './StyleSwitcher.svelte';
	import { map } from '../stores';
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
		if ($map.isStyleLoaded()) {
			style = $map.getStyle();
			allLayers = style.layers;
			updateVisibleLayers();
		} else {
			$map.on('load', updateLayers);
		}
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
		<FormField>
			<Checkbox bind:checked={onlyRendered} />
			<span slot="label">Show only rendered</span>
		</FormField>
		<FormField>
			<Checkbox bind:checked={onlyRelative} />
			<span slot="label">Show only water</span>
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

<style lang="scss">
	$height: calc(100vh - 64px);

	@media (max-width: 768px) {
		$height: calc(100vh - 184px);
	}

	.drawer-container {
		position: relative;
		display: flex;
		height: $height;
		border: 1px solid var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));
		overflow: auto;
		z-index: 0;

		.drawer-content {
			overflow: auto;
			display: flex;
			height: $height;
			flex-direction: column;
			flex-basis: 100%;
			flex: 1;
		}
	}

	:global(.app-content) {
		flex: auto;
		overflow: auto;
		position: relative;
		flex-grow: 1;
	}

	.main-content {
		overflow: auto;
		padding: 0px;
		height: 100%;
		width: 100%;
		box-sizing: border-box;
	}
</style>

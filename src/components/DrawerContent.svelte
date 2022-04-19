<script lang="ts">
	import Drawer, { AppContent, Content, Header } from '@smui/drawer';
	import List, { Item } from '@smui/list';
	import FormField from '@smui/form-field';
	import Checkbox from '@smui/checkbox';
	import type {
		StyleSpecification,
		LayerSpecification
	} from '@maplibre/maplibre-gl-style-spec/types';
	import { map } from '../stores';
	import Layer from './Layer.svelte';
	import StyleSwitcher from './StyleSwitcher.svelte';
	import { config } from '../config';

	export let open = false;
	let style: StyleSpecification = undefined;
	let onlyRendered = true;
	let onlyRelative = true;

	let allLayers: LayerSpecification[] = [];
	let visibleLayerMap = {};
	let relativeLayers = {};
	if (config.legend && config.legend.targets) {
		relativeLayers = config.legend.targets;
	}

	$: open, onOpened();

	const onOpened = () => {
		if (!$map) return;
		updateVisibleLayers();
		style = $map.getStyle();
		console.log(style.layers.length);
		allLayers = style.layers;
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
		$map.on('styledata', () => {
			const style = $map.getStyle();
			console.log(style.layers.length);
			allLayers = style.layers;
		});
	};

	if ($map) {
		style = $map.getStyle();
		allLayers = style.layers;

		$map.on('load', updateVisibleLayers);
		$map.on('moveend', updateVisibleLayers);
	}
</script>

<div class="drawer-container">
	<Drawer variant="dismissible" bind:open>
		<div class="drawer-content">
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
					{#key allLayers}
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
		</div>
	</Drawer>
	<AppContent class="app-content">
		<main class="main-content">
			<slot />
		</main>
	</AppContent>
</div>

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

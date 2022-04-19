<script lang="ts">
	import Drawer, { AppContent, Content, Header } from '@smui/drawer';
	import List, { Item } from '@smui/list';
	import Checkbox from '@smui/checkbox';
	import FormField from '@smui/form-field';
	import type {
		StyleSpecification,
		LayerSpecification
	} from '@maplibre/maplibre-gl-style-spec/types';
	import { map } from '../stores';
	import Layer from './Layer.svelte';

	export let open = false;
	let style: StyleSpecification = undefined;
	let onlyRendered = true;

	let allLayers: LayerSpecification[] = [];
	let visibleLayerMap = {};

	$: {
		if ($map) {
			style = $map.getStyle();
			allLayers = style.layers;

			$map.on('load', updateVisibleLayers);
			$map.on('moveend', updateVisibleLayers);
		}
	}

	$: open, updateVisibleLayers();

	const updateVisibleLayers = () => {
		visibleLayerMap = {};
		if ($map && $map.queryRenderedFeatures) {
			const features = $map.queryRenderedFeatures();
			for (let feature of features) {
				visibleLayerMap[feature.layer.id] = feature.layer;
			}
		}
	};
</script>

<div class="drawer-container">
	<Drawer variant="dismissible" bind:open>
		<div class="drawer-content">
			<Header>
				<FormField>
					<Checkbox bind:checked={onlyRendered} touch />
					<span slot="label">Only rendered</span>
				</FormField>
			</Header>
			<Content>
				<List>
					{#each allLayers as layer}
						{#if onlyRendered === false || (onlyRendered === true && visibleLayerMap[layer.id])}
							<Item>
								<Layer {layer} />
							</Item>
						{/if}
					{/each}
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
		box-sizing: border-box;
	}
</style>

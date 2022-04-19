<script lang="ts">
	import Drawer, { AppContent, Content, Header } from '@smui/drawer';
	import List, { Item } from '@smui/list';
	import SegmentedButton, { Segment, Label } from '@smui/segmented-button';
	import type {
		StyleSpecification,
		LayerSpecification
	} from '@maplibre/maplibre-gl-style-spec/types';
	import { map } from '../stores';
	import Layer from './Layer.svelte';
	import { config } from '../config';

	export let open = false;
	let style: StyleSpecification = undefined;
	let onlyRendered = true;
	let onlyRelative = true;

	// let choices = ['Only rendered', 'Water'];
	let choices = [
		{
			name: 'Rendered',
			selected: true
		},
		{
			name: 'Water',
			selected: true
		}
	];

	$: choices, setRenderFlags();
	const setRenderFlags = () => {
		onlyRendered = choices.find((choise) => {
			return choise.name === 'Rendered' && choise.selected;
		})
			? true
			: false;
		onlyRelative = choices.find((choise) => {
			return choise.name === 'Water' && choise.selected;
		})
			? true
			: false;
	};

	let allLayers: LayerSpecification[] = [];
	let visibleLayerMap = {};
	let relativeLayers = {};
	if (config.legend && config.legend.targets) {
		relativeLayers = config.legend.targets;
	}

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
				<SegmentedButton segments={choices} let:segment key={(segment) => segment.name}>
					<!--
					  When the selected prop is provided, Segment will no longer fire a "selected"
					  event.
					-->
					<Segment
						{segment}
						selected={segment.selected}
						on:click={() => {
							segment.selected = !segment.selected;
							// Remember to do this so Svelte knows that `choices` has changed.
							choices = choices;
						}}
					>
						<Label>{segment.name}</Label>
					</Segment>
				</SegmentedButton>
				<!-- <SegmentedButton segments={choices} let:segment bind:selected>
					<Segment {segment}>
					  <Label>{segment}</Label>
					</Segment>
				  </SegmentedButton> -->

				<!-- <FormField>
					<Checkbox bind:checked={onlyRendered} touch />
					<span slot="label">Only rendered</span>
				</FormField>
				<FormField>
					<Checkbox bind:checked={onlyRelative} touch />
					<span slot="label">Only relative</span>
				</FormField> -->
				<hr />
			</Header>
			<Content>
				<List>
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

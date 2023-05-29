<script lang="ts">
	import { map, selectedStyle } from '$lib/stores';
	import { config } from '$config';
	import { LegendPanel, LegendHeader } from '@watergis/svelte-maplibre-legend';
	import { StyleSwitcher } from '@watergis/svelte-maplibre-style-switcher';

	let onlyRendered = true;
	let onlyRelative = true;
	let enableLayerOrder = false;
	let relativeLayers = {};

	if (config.legend && config.legend.targets) {
		relativeLayers = config.legend.targets;
	}

	const onStyleChange = () => {
		if (!$map) return;
		$map.fire('style:change');
	};
</script>

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
		<LegendHeader
			bind:onlyRendered
			bind:onlyRelative
			bind:enableLayerOrder
			isLayerOrderShown={true}
		/>
	</div>
	<div class="legend-content">
		<LegendPanel
			bind:map={$map}
			bind:onlyRendered
			bind:onlyRelative
			bind:enableLayerOrder
			{relativeLayers}
			disableVisibleButton={false}
		/>
	</div>
</div>

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

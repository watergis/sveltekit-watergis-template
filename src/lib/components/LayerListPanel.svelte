<script lang="ts">
	import { config } from '$config';
	import { map, selectedStyle } from '$lib/stores';
	import { LegendPanel } from '@watergis/svelte-maplibre-legend';
	import { StyleSwitcher } from '@watergis/svelte-maplibre-style-switcher';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	let onlyRendered = true;
	let onlyRelative = true;
	let enableLayerOrder = false;
	let relativeLayers = {};

	let windowHeight: number;
	let tabHeight: Writable<number> = getContext('tab-height');
	let styleHeaderHeight: number;
	let legendHeaderHeight: number;

	$: contentHeight = windowHeight - $tabHeight - styleHeaderHeight - legendHeaderHeight - 20;

	if (config.legend && config.legend.targets) {
		relativeLayers = config.legend.targets;
	}

	const onStyleChange = () => {
		if (!$map) return;
		$map.fire('style:change');
	};
</script>

<svelte:window bind:innerHeight={windowHeight} />

<div class="style-header mb-1 p-1" bind:clientHeight={styleHeaderHeight}>
	<StyleSwitcher
		bind:map={$map}
		bind:selectedStyle={$selectedStyle}
		bind:styles={config.styles}
		on:change={onStyleChange}
	/>
</div>
<div class="mb-1 buttons has-addons is-centered" bind:clientHeight={legendHeaderHeight}>
	<button
		class="button {onlyRendered ? 'is-link' : 'is-light'}"
		on:click={() => (onlyRendered = !onlyRendered)}
	>
		<span class="icon is-small">
			<i class="fas fa-map"></i>
		</span>
		<span>Show rendered</span>
	</button>
	<button
		class="button {onlyRelative ? 'is-link' : 'is-light'}"
		on:click={() => (onlyRelative = !onlyRelative)}
	>
		<span class="icon is-small">
			<i class="fas fa-droplet"></i>
		</span>
		<span>Show related</span>
	</button>
	<button
		class="button {enableLayerOrder ? 'is-link' : 'is-light'}"
		on:click={() => (enableLayerOrder = !enableLayerOrder)}
	>
		<span class="icon is-small">
			<i
				class="fa-solid {enableLayerOrder
					? 'fa-arrow-down-up-across-line'
					: 'fa-arrow-down-up-lock'}"
			></i>
		</span>
	</button>
</div>
<div class="legend-content" style="height: {contentHeight}px">
	<LegendPanel
		bind:map={$map}
		bind:onlyRendered
		bind:onlyRelative
		bind:enableLayerOrder
		{relativeLayers}
		disableVisibleButton={false}
	/>
</div>

<style lang="scss">
	.legend-content {
		overflow-x: hidden;
		overflow-y: auto;
		width: 100%;
	}
</style>

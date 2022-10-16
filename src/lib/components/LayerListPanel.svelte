<script lang="ts">
	import type { StyleSpecification } from 'maplibre-gl';
	import StyleSwitcher from './StyleSwitcher.svelte';
	import { map } from '$lib/stores';
	import { config } from '$config';
	import LayerListPanel from '@watergis/svelte-maplibre-legend';

	let style: StyleSpecification = undefined;
	$: {
		if ($map) {
			$map.on('load', () => {
				style = $map.getStyle();
			});
		}
	}

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
			<StyleSwitcher on:change={onStyleChange} />
		</div>
		<LayerListPanel bind:map={$map} {relativeLayers} bind:style />
	</nav>
{/if}

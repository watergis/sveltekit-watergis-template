<script lang="ts">
	import { Content, Header } from '@smui/drawer';
	import type { StyleSpecification } from 'maplibre-gl';
	import StyleSwitcher from './StyleSwitcher.svelte';
	import { map } from '$lib/stores';
	import { config } from '../../config';
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
	<Header>
		<StyleSwitcher on:change={onStyleChange} />
	</Header>
	<Content>
		<LayerListPanel bind:map={$map} {relativeLayers} bind:style />
	</Content>
{/if}

<script lang="ts">
	import Select, { Option } from '@smui/select';
	import Icon from '@smui/select/icon';
	import { config } from '../config';
	import { map } from '../stores';
	import SearchControl from './SearchControl.svelte';

	export let isSearchTabVisible = false;
	let value = '';
	$: areas = config.areaSwitcher.areas;
	$: {
		if ($map && value !== '') {
			const selected = JSON.parse(value);
			$map.flyTo({ center: selected.latlng, zoom: selected.zoom, curve: 1 });
		}
	}
</script>

{#if isSearchTabVisible}
	<div class="select">
		<p>Search area of interest</p>
		<Select variant="outlined" bind:value label="Area">
			<Icon class="material-icons" slot="leadingIcon">zoom_in_map</Icon>
			<Option value="" />
			{#each areas as areas}
				<Option value={JSON.stringify(areas)}>{areas.title}</Option>
			{/each}
			<svelte:fragment slot="helperText">Select the area zooming to.</svelte:fragment>
		</Select>
	</div>

	<SearchControl />
{/if}

<style lang="scss">
	.select {
		padding-left: 1.5em;
	}
</style>

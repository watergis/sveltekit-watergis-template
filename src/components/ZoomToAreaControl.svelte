<script lang="ts">
	import Select, { Option } from '@smui/select';
	import Icon from '@smui/select/icon';
	import { config } from '../config';
	import { map } from '../stores';

	let value = '';
	$: areas = config.areaSwitcher.areas;
	$: {
		if ($map && value !== '') {
			const selected = JSON.parse(value);
			$map.flyTo({ center: selected.latlng, zoom: selected.zoom, curve: 1 });
		}
	}
</script>

{#if config.areaSwitcher}
	<div class="select">
		<Select variant="outlined" bind:value label="Area">
			<Icon class="material-icons" slot="leadingIcon">zoom_in_map</Icon>
			<Option value="" />
			{#each areas as areas}
				<Option value={JSON.stringify(areas)}>{areas.title}</Option>
			{/each}
			<svelte:fragment slot="helperText">Select the area zooming to.</svelte:fragment>
		</Select>
	</div>
{/if}

<style lang="scss">
	.select {
		padding-left: 0em;
	}
</style>

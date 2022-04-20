<script lang="ts">
	import Select, { Option } from '@smui/select';
	import { createEventDispatcher } from 'svelte';
	import { map, selectedStyle } from '../stores';
	import { config } from '../config';

	const dispatch = createEventDispatcher();
	let styleUrl = $selectedStyle.uri;
	$: styleUrl, setStyle();
	const setStyle = () => {
		if (!$map) return;
		$map.setStyle(styleUrl);
		$map.on('styledata', () => {
			dispatch('change');
		});
	};
</script>

<div class="style-switcher">
	<Select bind:value={styleUrl} label="Map theme">
		{#each config.styles as style}
			<Option value={style.uri}>{style.title}</Option>
		{/each}
		<svelte:fragment slot="helperText">Select and change base map</svelte:fragment>
	</Select>
</div>

<style>
	.style-switcher {
		padding-top: 10px;
	}
</style>

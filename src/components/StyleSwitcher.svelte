<script lang="ts">
	import Select, { Option } from '@smui/select';
	import { createEventDispatcher } from 'svelte';
	import { map, selectedStyle } from '../stores';
	import { config } from '../config';
	import StyleUrl from '$lib/style-url';

	const dispatch = createEventDispatcher();
	let styleUrl = $selectedStyle.uri;
	$: styleUrl, setStyle();
	$: $selectedStyle, updateStyleSelect();

	const setStyle = () => {
		if (!$map) return;
		$map.setStyle(styleUrl);
		$map.on('styledata', () => {
			const styleUrlObj = new StyleUrl();
			const _style = styleUrlObj.getMatchedStyleByUrl(config.styles, styleUrl);
			if (_style) {
				styleUrlObj.set(_style.title);
				selectedStyle.update(() => _style);
			} else {
				styleUrlObj.delete();
			}
			dispatch('change');
		});
	};

	const updateStyleSelect = () => {
		styleUrl = $selectedStyle.uri;
	};
</script>

<div class="style-switcher">
	<Select variant="outlined" bind:value={styleUrl} label="Map theme">
		{#each config.styles as style}
			<Option value={style.uri}>{style.title}</Option>
		{/each}
	</Select>
</div>

<style>
	.style-switcher {
		padding-top: 10px;
	}
</style>

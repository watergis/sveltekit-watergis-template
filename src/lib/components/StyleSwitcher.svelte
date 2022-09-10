<script lang="ts">
	import Select, { Option } from '@smui/select';
	import { createEventDispatcher } from 'svelte';
	import { map, selectedStyle } from '$lib/stores';
	import { config } from '../../config';
	import StyleUrl from '$lib/style-url';

	const dispatch = createEventDispatcher();
	let styleUrl = $selectedStyle.uri;
	$: styleUrl, setStyle();
	$: $selectedStyle, updateStyleSelect();

	const setStyle = () => {
		if (!$map) return;
		if (styleUrl === $selectedStyle.uri) return;
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
		if (styleUrl === $selectedStyle.uri) return;
		styleUrl = $selectedStyle.uri;
	};
</script>

<div class="style-switcher">
	<Select variant="outlined" bind:value={styleUrl} label="Map theme" style="width:100%">
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

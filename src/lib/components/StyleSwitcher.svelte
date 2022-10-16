<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { map, selectedStyle } from '$lib/stores';
	import { config } from '$config';
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

<div class="select is-link is-fullwidth mt-1">
	<select bind:value={styleUrl}>
		{#each config.styles as style}
			<option value={style.uri}>{style.title}</option>
		{/each}
	</select>
</div>

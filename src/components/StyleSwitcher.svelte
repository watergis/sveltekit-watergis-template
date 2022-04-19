<script lang="ts">
	import Select, { Option } from '@smui/select';
	import { createEventDispatcher } from 'svelte';
	import StyleUrl from '../lib/styleUrl';
	import { map } from '../stores';
	import { config } from '../config';

	const dispatch = createEventDispatcher();

	let value = config.styles[0].title;
	console.log(value);
	let styleUrl = new StyleUrl();
	styleUrl.matchUrl(config.styles);
	value = styleUrl.get();
	console.log(value);

	$: value, setStyle();
	const setStyle = () => {
		if (!$map) return;
		if (!styleUrl) return;
		let uri = styleUrl.getStyleUrl(config.styles);
		console.log(value);
		$map.setStyle(uri);
		$map.on('styledata', () => {
			styleUrl.set(value);
			console.log($map.getStyle().length, uri);
			dispatch('change');
		});
	};
</script>

<div class="style-switcher">
	<Select bind:value label="Map theme">
		{#each config.styles as item}
			<Option value={item.title}>{item.title}</Option>
		{/each}
	</Select>
</div>

<style>
	.style-switcher {
		padding-top: 10px;
	}
</style>

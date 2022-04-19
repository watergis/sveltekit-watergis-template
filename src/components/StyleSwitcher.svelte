<script lang="ts">
	import Select, { Option } from '@smui/select';
	import { createEventDispatcher } from 'svelte';
	import { map } from '../stores';
	import { config } from '../config';

	const dispatch = createEventDispatcher();

	let value = config.styles[0].title;
	$: value, setStyle();
	const setStyle = () => {
		if (!$map) return;
		let uri: string;
		config.styles.forEach((style) => {
			if (style.title === value) {
				uri = style.uri;
			}
		});
		// let uri = styleUrl.getStyleUrl(config.styles);
		// console.log(value);
		$map.setStyle(uri);
		$map.on('styledata', () => {
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

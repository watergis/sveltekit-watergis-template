<script lang="ts">
	import type { LayerSpecification } from 'maplibre-gl';
	import { map } from '$lib/stores';
	import Legend from './Legend.svelte';
	import { config } from '../../config';
	import Fa from 'svelte-fa';
	import { faEye } from '@fortawesome/free-solid-svg-icons/faEye';
	import { faEyeSlash } from '@fortawesome/free-solid-svg-icons/faEyeSlash';

	export let layer: LayerSpecification;
	let visibility = 'visible';
	if (layer.layout && layer.layout.visibility === 'none') {
		visibility = 'none';
	}

	let checked = visibility === 'visible' ? true : false;
	$: checked, setVisibility();

	const setVisibility = () => {
		$map.setLayoutProperty(layer.id, 'visibility', checked === true ? 'visible' : 'none');
	};
</script>

<div class="columns is-vcentered">
	<div class="column .is-marginless is-paddingless">
		<button class="button is-text is-narrow" on:click={() => (checked = !checked)}>
			{#if checked}
				<Fa icon={faEye} scale={1} />
			{:else}
				<Fa icon={faEyeSlash} scale={1} />
			{/if}
		</button>
	</div>
	<div class="column is-narrow .is-marginless is-paddingless">
		<Legend {layer} />
	</div>
	<div class="column is-narrow .is-marginless pl-2 has-text-left">
		{config.legend && config.legend.targets && config.legend.targets[layer.id]
			? config.legend.targets[layer.id]
			: layer.id}
	</div>
</div>

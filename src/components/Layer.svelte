<script lang="ts">
	import type { LayerSpecification } from '@maplibre/maplibre-gl-style-spec/types';
	import Checkbox from '@smui/checkbox';
	import FormField from '@smui/form-field';
	import { map } from '../stores';
	import Legend from './Legend.svelte';
	import { config } from '../config';

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

<div>
	<FormField>
		<Checkbox bind:checked touch />
		<Legend {layer} />
		<span slot="label"
			>{config.legend && config.legend.targets && config.legend.targets[layer.id]
				? config.legend.targets[layer.id]
				: layer.id}</span
		>
	</FormField>
</div>

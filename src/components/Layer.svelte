<script lang="ts">
	import type { LayerSpecification } from 'maplibre-gl';
	import FormField from '@smui/form-field';
	import IconButton, { Icon } from '@smui/icon-button';
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
		<div style="display: flex; align-items: center;">
			<IconButton toggle bind:pressed={checked}>
				<Icon class="material-icons" on>visibility</Icon>
				<Icon class="material-icons">visibility_off</Icon>
			</IconButton>
		</div>
		<Legend {layer} />
		<span slot="label">
			{config.legend && config.legend.targets && config.legend.targets[layer.id]
				? config.legend.targets[layer.id]
				: layer.id}
		</span>
	</FormField>
</div>

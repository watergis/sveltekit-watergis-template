<script lang="ts">
	import Textfield from '@smui/textfield';
	import { map, valhallaControlData } from '$lib/stores';
	import { config } from '../../config';
	import ValhallaIsochrone, { Costing, ContourType } from '$lib/valhalla-isochrone';
	import Fa from 'svelte-fa';
	import { faClock } from '@fortawesome/free-solid-svg-icons/faClock';
	import { faRoute } from '@fortawesome/free-solid-svg-icons/faRoute';
	import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';

	export let contourType;
	let longitude: number;
	let latitude: number;
	let contours = config.valhalla?.options.Contours;
	if (!contours) {
		contours = [
			{
				time: 5,
				distance: 1,
				color: 'ff0000'
			},
			{
				time: 10,
				distance: 3,
				color: 'ffff00'
			},
			{
				time: 15,
				distance: 5,
				color: '0000ff'
			}
		];
	}

	let costingOptions = [
		{
			value: Costing.Walking,
			label: 'Walking'
		},
		{
			value: Costing.Bicycle,
			label: 'Bicycle'
		},
		{
			value: Costing.Car,
			label: 'Car'
		}
	];

	let meansOfTransport = costingOptions[0].value;

	$: {
		if ($map) {
			if (!$valhallaControlData) {
				const data: { [key: string]: ValhallaIsochrone } = {};
				valhallaControlData.update(() => data);
			}
			if (!$valhallaControlData[contourType]) {
				$valhallaControlData[contourType] = new ValhallaIsochrone($map, config.valhalla.url);
			}
			longitude = Number($map.getCenter().lng.toFixed(6));
			latitude = Number($map.getCenter().lat.toFixed(6));
			$map.on('moveend', () => {
				longitude = Number($map.getCenter().lng.toFixed(6));
				latitude = Number($map.getCenter().lat.toFixed(6));
			});
		}
	}
	const calc = (contourType: string) => {
		$valhallaControlData[contourType].getIsochrone(
			Number(longitude),
			Number(latitude),
			contourType,
			meansOfTransport,
			JSON.parse(JSON.stringify(contours))
		);
	};
	const clear = () => {
		$valhallaControlData[contourType].clearFeatures();
	};
</script>

{#if config.valhalla}
	<div>
		<div class="select is-link is-fullwidth">
			<select bind:value={meansOfTransport}>
				{#each costingOptions as item}
					<option value={item.value}>{item.label}</option>
				{/each}
			</select>
		</div>
		<div style="display:inline-flex">
			<Textfield bind:value={longitude} label="Longitude" readonly />
			<Textfield bind:value={latitude} label="Latitude" readonly />
		</div>
	</div>
	{#if contourType === ContourType.Time}
		<div style="display:inline-flex">
			{#each contours as contour}
				<Textfield bind:value={contour.time} label="{contour.time} min" type="number" />
			{/each}
		</div>
		<div style="padding-top:5px;">
			<button class="button is-light is-fullwidth" on:click={clear}>
				<Fa icon={faTrash} scale={1} />
				<div style="padding-left:5px;">Clear</div>
			</button>
		</div>
		<div style="padding-top:5px;">
			<button class="button is-info is-fullwidth" on:click={() => calc(ContourType.Time)}>
				<Fa icon={faClock} scale={1} />
				<div style="padding-left:5px;">Calculate</div>
			</button>
		</div>
	{:else if contourType === ContourType.Distance}
		<div style="display:inline-flex">
			{#each contours as contour}
				<Textfield bind:value={contour.distance} label="{contour.distance} km" type="number" />
			{/each}
		</div>
		<div style="padding-top:5px;">
			<button class="button is-light is-fullwidth" on:click={clear}>
				<Fa icon={faTrash} scale={1} />
				<div style="padding-left:5px;">Clear</div>
			</button>
		</div>
		<div style="padding-top:5px;">
			<button class="button is-info is-fullwidth" on:click={() => calc(ContourType.Distance)}>
				<Fa icon={faRoute} scale={1} />
				<div style="padding-left:5px;">Calculate</div>
			</button>
		</div>
	{/if}
{/if}

<style lang="scss">
	// .select {
	// 	padding-top: 0.5em;
	// 	padding-bottom: 0.5em;
	// }
	// .button {
	// 	padding-top: 0.5em;
	// 	display: flex;
	// 	flex-direction: column;
	// 	align-items: flex-end;
	// }
</style>

<script lang="ts">
	import Select, { Option } from '@smui/select';
	import Textfield from '@smui/textfield';
	import Button, { Label, Icon } from '@smui/button';
	import { map, valhallaControlData } from '$lib/stores';
	import { config } from '$config';
	import ValhallaIsochrone, { Costing, ContourType } from '$lib/valhalla-isochrone';

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
			longitude = $map.getCenter().lng;
			latitude = $map.getCenter().lat;
			$map.on('moveend', () => {
				longitude = $map.getCenter().lng;
				latitude = $map.getCenter().lat;
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
	<div class="transport-select">
		<div>
			<Select bind:value={meansOfTransport} label="Means of Transport" style="width:100%">
				{#each costingOptions as item}
					<Option value={item.value}>{item.label}</Option>
				{/each}
			</Select>
		</div>
		<div style="display:inline-flex">
			<Textfield bind:value={longitude} label="Longitude" readonly />
			<Textfield bind:value={latitude} label="Latitude" readonly />
		</div>
	</div>
	<div style="display:inline-flex">
		{#each contours as contour}
			{#if contourType === ContourType.Time}
				<Textfield bind:value={contour.time} label="{contour.time} min" type="number" />
			{:else}
				<Textfield bind:value={contour.distance} label="{contour.distance} km" type="number" />
			{/if}
		{/each}
	</div>
	<div class="tool-button">
		<Button on:click={() => calc(contourType)} variant="raised" color="primary" style="width:100%">
			<Icon class="material-icons">straighten</Icon>
			<Label>Calculate</Label>
		</Button>
	</div>
	<div class="tool-button">
		<Button on:click={() => clear()} variant="raised" color="secondary" style="width:100%">
			<Icon class="material-icons">delete</Icon>
			<Label>Clear</Label>
		</Button>
	</div>
{/if}

<style lang="scss">
	.transport-select {
		padding-top: 0.5em;
		padding-bottom: 0.5em;
	}
	.tool-button {
		padding-top: 0.5em;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}
</style>

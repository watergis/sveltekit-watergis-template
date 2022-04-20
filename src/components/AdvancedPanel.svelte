<script lang="ts">
	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
	import Select, { Option } from '@smui/select';
	import Textfield from '@smui/textfield';
	import Button, { Label, Icon } from '@smui/button';
	import { map } from '../stores';
	import { config } from '../config';
	import Valhalla, { Costing, ContourType } from '$lib/valhalla';

	export let isAdvancedTabVisible = false;
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

	let valhalla = null;

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
			if (valhalla) {
				valhalla.clearFeatures();
			}
			valhalla = new Valhalla($map, config.valhalla.url, contours);
			longitude = $map.getCenter().lng;
			latitude = $map.getCenter().lat;
		}
	}
	const calc = (contourType: string) => {
		valhalla.getIsochrone(
			Number(longitude),
			Number(latitude),
			contourType,
			meansOfTransport,
			JSON.parse(JSON.stringify(contours))
		);
	};
	const clear = () => {
		valhalla.clearFeatures();
	};
</script>

{#if isAdvancedTabVisible}
	<div class="select">
		<Select bind:value={meansOfTransport} label="Means of Transport">
			<Option value="" />
			{#each costingOptions as item}
				<Option value={item.value}>{item.label}</Option>
			{/each}
			<svelte:fragment slot="helperText">
				This is to calculate isochrone map from the center of the map by selected transport methods.
				The feature is provided by Valhalla API.
			</svelte:fragment>
		</Select>
		<Textfield bind:value={longitude} label="Longitude" readonly />
		<Textfield bind:value={latitude} label="Latitude" readonly />

		<div class="button">
			<Button on:click={() => clear()} variant="raised" color="secondary" style="width:100%">
				<Icon class="material-icons">layers_clear</Icon>
				<Label>Clear</Label>
			</Button>
		</div>
	</div>
	<div class="accordion-container">
		<Accordion>
			<Panel>
				<Header>Time Isochrone</Header>
				<Content>
					<div style="display:inline-flex">
						{#each contours as contour}
							<Textfield bind:value={contour.time} label="{contour.time} min" type="number" />
						{/each}
					</div>
					<div class="button">
						<Button
							on:click={() => calc(ContourType.Time)}
							variant="raised"
							color="primary"
							style="width:100%"
						>
							<Icon class="material-icons">access_time</Icon>
							<Label>Calculate</Label>
						</Button>
					</div>
				</Content>
			</Panel>
			<Panel>
				<Header>Distance Isochrone</Header>
				<Content>
					<div style="display:inline-flex">
						{#each contours as contour}
							<Textfield
								bind:value={contour.distance}
								label="{contour.distance} km"
								type="number"
							/>
						{/each}
					</div>
					<div class="button">
						<Button
							on:click={() => calc(ContourType.Distance)}
							variant="raised"
							color="primary"
							style="width:100%"
						>
							<Icon class="material-icons">straighten</Icon>
							<Label>Calculate</Label>
						</Button>
					</div>
				</Content>
			</Panel>
		</Accordion>
	</div>
{/if}

<style lang="scss">
	.select {
		padding: 1em;
	}
	.button {
		padding: 1em 1em 0.5em 1em;
	}
</style>

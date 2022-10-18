<script lang="ts">
	import Textfield from '@smui/textfield';
	import { map, valhallaControlData } from '$lib/stores';
	import { config } from '$config';
	import ValhallaIsochrone, { ContourType } from '$lib/valhalla-isochrone';
	import { costingOptions } from '$lib/constants';

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
		<div class="field">
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label class="label">Means of Transport</label>
			<div class="control">
				{#each costingOptions as item}
					<label class="radio" style="color:black">
						<input
							type="radio"
							name="transport-{contourType}"
							on:click={() => {
								meansOfTransport = item.value;
							}}
							checked={meansOfTransport === item.value}
						/>
						<div class="icon is-small is-left pl-3 pr-3">
							<i class="fas {item.icon}" />
						</div>
						{item.label}
					</label>
				{/each}
			</div>
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
	<div class="columns is-vcentered pt-2">
		<div class="column is-half px-1 py-4">
			<button class="button is-fullwidth is-link" on:click={() => calc(contourType)}>
				<span class="icon is-small">
					{#if contourType === ContourType.Time}
						<i class="fas fa-clock" />
					{:else}
						<i class="fas fa-ruler" />
					{/if}
				</span>
				<span> Calculate </span>
			</button>
		</div>
		<div class="column is-half px-1 py-4">
			<button class="button is-fullwidth is-link is-light" on:click={clear}>
				<span class="icon is-small">
					<i class="fas fa-trash" />
				</span>
				<span> Clear </span>
			</button>
		</div>
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

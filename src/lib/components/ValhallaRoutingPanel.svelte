<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Button, { Label, Icon } from '@smui/button';
	import Select, { Option } from '@smui/select';
	import Textfield from '@smui/textfield';
	import type { GeoJSONFeature, MapMouseEvent } from 'maplibre-gl';
	import { map, valhallaRoutingData, errorMessage } from '$lib/stores';
	import { config } from '$config';
	import { Costing } from '$lib/valhalla-isochrone';
	import type { ValhallaTripResult, ValhallaTripSummary, ValhallaError } from '$lib/types';

	const SOURCE_LINE = 'routing-controls-source-line';
	const LAYER_LINE = 'routing-controls-layer-line';
	const LAYER_LINE_LABEL = 'routing-controls-layer-line-label';
	const LAYER_SYMBOL = 'routing-controls-layer-symbol';
	const SOURCE_SYMBOL = 'routing-controls-source-symbol';

	const routingOptions = config.valhalla.options.routing;
	let isRouting = false;

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
	let tripSummary: ValhallaTripSummary;

	onMount(() => {
		if (!$valhallaRoutingData) {
			valhallaRoutingData.update(() => []);
		}
	});

	onDestroy(() => {
		if (isRouting === true) {
			addingPointOff();
		}
	});

	const handleAddPoint = () => {
		if (isRouting) {
			addingPointOff();
		} else {
			addingPointOn();
		}
	};

	const addingPointOn = () => {
		if ($map) {
			$map.getCanvas().style.cursor = 'crosshair';
			isRouting = true;
			$map.on('click', mapClickListener);
			$map.fire('routing.on');
		}
	};

	const addingPointOff = () => {
		isRouting = false;
		if ($map) {
			$map.getCanvas().style.cursor = '';
			$map.off('click', mapClickListener);
			$map.fire('routing.off');
		}
	};

	const mapClickListener = (event: MapMouseEvent) => {
		const lnglat = event.lngLat;
		if (!$valhallaRoutingData) valhallaRoutingData.update(() => []);
		valhallaRoutingData.update(() => [...$valhallaRoutingData, lnglat]);
	};

	const clearFeatures = () => {
		if ($map) {
			if ($map.getLayer(LAYER_LINE)) $map.removeLayer(LAYER_LINE);
			if ($map.getLayer(LAYER_LINE_LABEL)) $map.removeLayer(LAYER_LINE_LABEL);
			if ($map.getLayer(LAYER_SYMBOL)) $map.removeLayer(LAYER_SYMBOL);
			if ($map.getSource(SOURCE_LINE)) $map.removeSource(SOURCE_LINE);
			if ($map.getSource(SOURCE_SYMBOL)) $map.removeSource(SOURCE_SYMBOL);
		}
		valhallaRoutingData.update(() => []);
	};

	$: $valhallaRoutingData, calcRoute();
	$: meansOfTransport, calcRoute();

	const calcRoute = () => {
		if (!$valhallaRoutingData || ($valhallaRoutingData && $valhallaRoutingData.length < 2)) {
			tripSummary = undefined;
			return;
		}
		const baseAPI = `${config.valhalla.url}/route`;
		const options = {
			locations: $valhallaRoutingData.map((pt) => {
				return { lon: pt.lng, lat: pt.lat };
			}),
			costing: meansOfTransport,
			costing_options: { auto: { country_crossing_penalty: 2000.0 } },
			units: 'kilometers',
			id: 'my_work_route'
		};
		const url = `${baseAPI}?json=${JSON.stringify(options)}`;

		fetch(url)
			.then((res) => res.json())
			.then((json: ValhallaTripResult | ValhallaError) => {
				if ('error' in json) {
					$valhallaRoutingData.pop(); //remove the last coordinates which cause error
					throw new Error(
						`${json.status} (${json.status_code}): ${json.error} (${json.error_code})`
					);
				}
				let shapes = json.trip.legs.map((s) => decodeShape(s.shape));
				let shape: number[][] = [];
				shapes.forEach((shp) => {
					shape = [...shape, ...shp];
				});
				tripSummary = json.trip.summary;
				tripSummary.length = Number(tripSummary.length.toFixed(2));
				tripSummary.time = Number((tripSummary.time / 60).toFixed());

				const features = {
					type: 'FeatureCollection',
					features: json.trip.legs.map((leg) => {
						const shape = decodeShape(leg.shape);
						const props = {
							length: Number(leg.summary.length.toFixed(2)),
							time: Number((leg.summary.time / 60).toFixed())
						};
						return geoLineString(shape, props);
					})
				};

				const pointFeatures = geoPoint($valhallaRoutingData.map((pt) => [pt.lng, pt.lat]));

				if ($map) {
					if (!$map.getSource(SOURCE_LINE)) {
						$map.addSource(SOURCE_LINE, {
							type: 'geojson',
							data: features
						});
						$map.addSource(SOURCE_SYMBOL, {
							type: 'geojson',
							data: pointFeatures
						});
						$map.addLayer({
							id: LAYER_LINE,
							type: 'line',
							source: SOURCE_LINE,
							paint: {
								'line-color': 'rgb(255,0,0)',
								'line-width': 4
							}
						});

						$map.addLayer({
							id: LAYER_LINE_LABEL,
							type: 'symbol',
							source: SOURCE_LINE,
							layout: {
								'text-field': [
									'concat',
									['to-string', ['get', 'length']],
									' km (',
									['to-string', ['get', 'time']],
									' min)'
								],
								'text-font': routingOptions.font,
								'text-size': routingOptions.fontSize,
								'symbol-placement': 'line',
								'text-allow-overlap': true,
								'text-ignore-placement': true
							},
							paint: {
								'text-color': routingOptions.fontColor,
								'text-halo-color': routingOptions.fontHaloColor,
								'text-halo-width': routingOptions.fontHalo
							}
						});

						$map.addLayer({
							id: LAYER_SYMBOL,
							type: 'symbol',
							source: SOURCE_SYMBOL,
							layout: {
								'icon-image': routingOptions.iconImage,
								'icon-size': routingOptions.iconSize,
								'text-field': ['get', 'text'],
								'text-font': routingOptions.font,
								'text-size': routingOptions.fontSize,
								'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
								'text-radial-offset': 0.8,
								'text-justify': 'auto'
							},
							paint: {
								'text-color': routingOptions.fontColor,
								'text-halo-color': routingOptions.fontHaloColor,
								'text-halo-width': routingOptions.fontHalo
							}
						});
					} else {
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						$map.getSource(SOURCE_LINE).setData(features);
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						$map.getSource(SOURCE_SYMBOL).setData(pointFeatures);
					}
				}
			})
			.catch((err: ErrorEvent) => {
				errorMessage.update(() => [...$errorMessage, err.message]);
			});
	};

	const geoLineString = (
		coordinates: number[][] = [],
		props: { [key: string]: string | number } = {}
	): GeoJSONFeature => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		return {
			type: 'Feature',
			properties: props,
			geometry: {
				type: 'LineString',
				coordinates
			}
		};
	};

	const geoPoint = (coordinates: number[][] = []): GeoJSONFeature => {
		return {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			type: 'FeatureCollection',
			features: coordinates.map((c, i) => {
				let text = (i + 1).toString();
				if (i === 0) {
					text = 'From';
				} else if (i === coordinates.length - 1) {
					text = 'To';
				}
				return {
					type: 'Feature',
					properties: {
						text
					},
					geometry: {
						type: 'Point',
						coordinates: c
					}
				};
			})
		};
	};

	const decodeShape = (value: string, precision = 6) => {
		let index = 0,
			lat = 0,
			lng = 0,
			coordinates: number[][] = [],
			shift = 0,
			result = 0,
			byte = null,
			latitude_change,
			longitude_change,
			factor = Math.pow(10, precision || 6);

		// Coordinates have variable length when encoded, so just keep
		// track of whether we've hit the end of the string. In each
		// loop iteration, a single coordinate is decoded.
		while (index < value.length) {
			// Reset shift, result, and byte
			byte = null;
			shift = 0;
			result = 0;

			do {
				byte = value.charCodeAt(index++) - 63;
				result |= (byte & 0x1f) << shift;
				shift += 5;
			} while (byte >= 0x20);

			latitude_change = result & 1 ? ~(result >> 1) : result >> 1;

			shift = result = 0;

			do {
				byte = value.charCodeAt(index++) - 63;
				result |= (byte & 0x1f) << shift;
				shift += 5;
			} while (byte >= 0x20);

			longitude_change = result & 1 ? ~(result >> 1) : result >> 1;

			lat += latitude_change;
			lng += longitude_change;

			coordinates.push([lng / factor, lat / factor]);
		}

		return coordinates;
	};
</script>

{#if config.valhalla}
	<div>
		<Select bind:value={meansOfTransport} label="Means of Transport" style="width:100%">
			{#each costingOptions as item}
				<Option value={item.value}>{item.label}</Option>
			{/each}
		</Select>
	</div>

	<div class="tool-button" style="display: flex; align-items: center;">
		<Button color="primary" variant="raised" on:click={handleAddPoint} style="width:100%">
			<Icon class="material-icons">
				{#if isRouting}
					close
				{:else}
					route
				{/if}
			</Icon>
			<Label>
				{#if isRouting}
					Stop routing
				{:else}
					Start routing
				{/if}
			</Label>
		</Button>
	</div>

	{#if $valhallaRoutingData && $valhallaRoutingData.length > 0}
		<div class="sub-button tool-button">
			<Button
				on:click={() => clearFeatures()}
				variant="raised"
				color="secondary"
				style="width:100%"
			>
				<Icon class="material-icons">delete</Icon>
				<Label>Clear</Label>
			</Button>
		</div>

		<div style="display:inline-flex; width: 100%">
			<Textfield
				value={`${$valhallaRoutingData[0].lng.toFixed(6)}, ${$valhallaRoutingData[0].lat.toFixed(
					6
				)}`}
				label="From"
				readonly
				style="width: 50%"
			/>

			{#if $valhallaRoutingData.length > 1}
				<Textfield
					value={`${$valhallaRoutingData[$valhallaRoutingData.length - 1].lng.toFixed(
						6
					)}, ${$valhallaRoutingData[$valhallaRoutingData.length - 1].lat.toFixed(6)}`}
					label="To"
					readonly
					style="width: 50%"
				/>
			{/if}
		</div>

		{#if tripSummary}
			<div style="display:inline-flex; width: 100%">
				<Textfield value={`${tripSummary.length} km`} label="Length" readonly style="width: 50%" />
				<Textfield value={`${tripSummary.time} min`} label="Time" readonly style="width: 50%" />
			</div>
		{/if}
	{/if}
{/if}

<style lang="scss">
	.tool-button {
		padding-top: 0.5em;
		padding-left: 0.5em;
		padding-right: 0.5em;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}
</style>

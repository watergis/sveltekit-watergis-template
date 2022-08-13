<script lang="ts">
	import Button, { Label, Icon } from '@smui/button';
	import type { GeoJSONFeature, MapMouseEvent } from 'maplibre-gl';
	import { map, valhallaRoutingData } from '../stores';
	import { config } from '../config';

	const SOURCE_LINE = 'routing-controls-source-line';
	const LAYER_LINE = 'routing-controls-layer-line';
	const LAYER_LINE_LABEL = 'routing-controls-layer-line-label';
	const routingOptions = config.valhalla.options.routing;
	let isRouting = false;

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
			if ($map.getSource(SOURCE_LINE)) $map.removeSource(SOURCE_LINE);
		}
		valhallaRoutingData.update(() => []);
	};

	$: $valhallaRoutingData, calcRoute();
	const calcRoute = async () => {
		if (!$valhallaRoutingData || ($valhallaRoutingData && $valhallaRoutingData.length < 2)) {
			return;
		}
		const baseAPI = `${config.valhalla.url}/route`;
		const options = {
			locations: $valhallaRoutingData.map((pt) => {
				return { lon: pt.lng, lat: pt.lat };
			}),
			costing: 'pedestrian',
			costing_options: { auto: { country_crossing_penalty: 2000.0 } },
			units: 'kilometers',
			id: 'my_work_route'
		};
		const url = `${baseAPI}?json=${JSON.stringify(options)}`;
		const res = await fetch(url);
		const json = await res.json();
		let shapes = json.trip.legs.map((s) => decodeShape(s.shape));
		let shape = [];
		shapes.forEach((shp) => {
			shape = [...shape, ...shp];
		});
		const props = {
			length: json.trip.summary.length.toFixed(2),
			time: (json.trip.summary.time / 60).toFixed()
		};
		const feature = geoLineString(shape, props);

		if ($map) {
			if (!$map.getSource(SOURCE_LINE)) {
				$map.addSource(SOURCE_LINE, {
					type: 'geojson',
					data: feature
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
			} else {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				$map.getSource(SOURCE_LINE).setData(feature);
			}
		}
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

	const decodeShape = (value: string, precision = 6) => {
		var index = 0,
			lat = 0,
			lng = 0,
			coordinates = [],
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
	<div class="button" style="display: flex; align-items: center;">
		<Button color="primary" variant="raised" on:click={handleAddPoint} style="width:100%">
			<Icon class="material-icons">
				{#if isRouting}
					close
				{:else}
					add
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
		<div class="sub-button button">
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
	{/if}
{/if}

<style lang="scss">
	.button {
		padding-top: 0.5em;
		padding-left: 0.5em;
		padding-right: 0.5em;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}
</style>

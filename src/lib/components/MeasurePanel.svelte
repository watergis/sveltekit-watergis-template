<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { TerrainRGB } from '@watergis/terrain-rgb';
	import distance from '@turf/distance';
	import { Marker, MapMouseEvent, GeoJSONFeature } from 'maplibre-gl';
	import { map, measureControlData } from '$lib/stores';
	import { config } from '../../config';
	import type { MeasureControlData } from '$lib/types';
	import Fa from 'svelte-fa';
	import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
	import { faRuler } from '@fortawesome/free-solid-svg-icons/faRuler';
	import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
	import { faDownload } from '@fortawesome/free-solid-svg-icons/faDownload';

	const SOURCE_LINE = 'elev-controls-source-line';
	const LAYER_LINE = 'elev-controls-layer-line';
	const LAYER_SYMBOL = 'elev-controls-layer-symbol';
	const SOURCE_SYMBOL = 'elev-controls-source-symbol';

	let isQuery: boolean;
	let units = config.elevation.options.units || 'kilometers';

	let hasData = false;

	onMount(() => {
		if (!$measureControlData) {
			const data: MeasureControlData = {
				markers: [],
				coordinates: [],
				elevations: []
			};
			measureControlData.update(() => data);
		} else {
			if ($measureControlData.coordinates.length > 0) {
				hasData = true;
			}
		}
	});

	onDestroy(() => {
		if (isQuery === true) {
			measuringOff();
		}
	});

	const measureStart = () => {
		if (isQuery) {
			measuringOff();
		} else {
			measuringOn();
		}
	};

	const measuringOn = () => {
		if ($map) {
			$map.getCanvas().style.cursor = 'crosshair';
			isQuery = true;
			$map.on('click', mapClickListener);
			$map.fire('elevation.on');
		}
	};

	const measuringOff = () => {
		isQuery = false;
		if ($map) {
			$map.getCanvas().style.cursor = '';
			$map.off('click', mapClickListener);
			$map.fire('elevation.off');
		}
	};

	const clearFeatures = () => {
		if ($map) {
			if ($map.getLayer(LAYER_LINE)) $map.removeLayer(LAYER_LINE);
			if ($map.getLayer(LAYER_SYMBOL)) $map.removeLayer(LAYER_SYMBOL);
			if ($map.getSource(SOURCE_LINE)) $map.removeSource(SOURCE_LINE);
			if ($map.getSource(SOURCE_SYMBOL)) $map.removeSource(SOURCE_SYMBOL);
		}
		$measureControlData.markers.forEach((m) => m.remove());
		hasData = false;
	};

	const mapClickListener = (event: MapMouseEvent) => {
		if (!$map?.getSource(SOURCE_LINE) || !$map?.getSource(SOURCE_SYMBOL)) {
			clearFeatures();
			initFeatures();
		}
		let zoom = $map?.getZoom();
		if (!zoom) {
			zoom = 15;
		}
		zoom = Math.round(zoom);
		const lnglat: number[] = [event.lngLat.lng, event.lngLat.lat];
		const trgb = new TerrainRGB(config.elevation.url, config.elevation.options.tileSize);
		trgb.getElevation(lnglat, zoom).then((elev) => {
			if (!elev) elev = -1;
			if ($map) {
				const marker = new Marker({
					draggable: true
				})
					.setLngLat(event.lngLat)
					.addTo($map);
				$measureControlData.markers.push(marker);

				$measureControlData.coordinates.push([lnglat[0], lnglat[1], elev]);
				$measureControlData.elevations.push(elev);
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				$map.getSource(SOURCE_LINE).setData(geoLineString($measureControlData.coordinates));
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				$map.getSource(SOURCE_SYMBOL).setData(geoPoint($measureControlData.coordinates));

				hasData = true;
			}
		});
	};

	const initFeatures = () => {
		$measureControlData.markers = [];
		$measureControlData.coordinates = [];
		$measureControlData.elevations = [];
		if ($map) {
			$map.addSource(SOURCE_LINE, {
				type: 'geojson',
				data: geoLineString($measureControlData.coordinates)
			});
			$map.addSource(SOURCE_SYMBOL, {
				type: 'geojson',
				data: geoPoint($measureControlData.coordinates)
			});
			$map.addLayer({
				id: LAYER_LINE,
				type: 'line',
				source: SOURCE_LINE,
				paint: {
					'line-color': config.elevation.options.mainColor,
					'line-width': 2
				}
			});
			$map.addLayer({
				id: LAYER_SYMBOL,
				type: 'symbol',
				source: SOURCE_SYMBOL,
				layout: {
					'text-field': '{text}',
					'text-font': config.elevation.options.font,
					'text-size': config.elevation.options.fontSize,
					'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
					'text-radial-offset': 0.8,
					'text-justify': 'auto'
				},
				paint: {
					'text-color': config.elevation.options.mainColor,
					'text-halo-color': config.elevation.options.haloColor,
					'text-halo-width': config.elevation.options.fontHalo
				}
			});
		}
	};

	const labelFormat = (length: number, elevation: number) => {
		let lengthLabel = `${length.toFixed(2)} km`;
		if (length < 1) {
			lengthLabel = `${(length * 1000).toFixed()} m`;
		}
		let elevLabel = '';
		if (elevation > 0) {
			elevLabel = `\nalt.${elevation}m`;
		}
		return `${lengthLabel}${elevLabel}`;
	};

	const geoLineString = (coordinates: number[][] = []): GeoJSONFeature => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		return {
			type: 'Feature',
			properties: {},
			geometry: {
				type: 'LineString',
				coordinates
			}
		};
	};

	const geoPoint = (coordinates: number[][] = []): GeoJSONFeature => {
		let sum = 0;
		return {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			type: 'FeatureCollection',
			features: coordinates.map((c, i) => {
				if (i > 0) {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					sum += distance(coordinates[i - 1], coordinates[i], { units });
				}
				return {
					type: 'Feature',
					properties: {
						id: i + 1,
						text: labelFormat(sum, c[2]),
						elevation: c[2],
						length: (sum * 1000).toFixed()
					},
					geometry: {
						type: 'Point',
						coordinates: c
					}
				};
			})
		};
	};

	const downloadGeoJSON = () => {
		if ($measureControlData.coordinates.length === 0) return;
		const points = geoPoint($measureControlData.coordinates);
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		points.features.forEach((f) => {
			delete f.properties.text;
		});
		if ($measureControlData.coordinates.length > 1) {
			const line = geoLineString($measureControlData.coordinates);
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			points.features.push(line);
		}
		const fileName = 'measure_result.geojson';
		const content = JSON.stringify(points);
		download(fileName, content);
	};

	const download = (fileName: string, content: string) => {
		const blob = new Blob([content], { type: 'text/plain' });
		const aTag = document.createElement('a');
		aTag.href = URL.createObjectURL(blob);
		aTag.setAttribute('download', fileName);
		aTag.dispatchEvent(new MouseEvent('click'));
	};
</script>

{#if config.elevation}
	<button class="button is-info is-fullwidth" on:click={() => measureStart()}>
		{#if isQuery}
			<Fa icon={faXmark} scale={1} />
		{:else}
			<Fa icon={faRuler} scale={1} />
		{/if}
		<div style="padding-left:5px;">
			{#if isQuery}
				Stop measure
			{:else}
				Start measure
			{/if}
		</div>
	</button>
	{#if hasData}
		<div class="columns" style="padding-top:5px;">
			<div class="column is-half">
				<button class="button is-light is-fullwidth" on:click={() => clearFeatures()}>
					<Fa icon={faTrash} scale={1} />
					<div style="padding-left:5px;">Clear</div>
				</button>
			</div>
			<div class="column is-half">
				<button class="button is-light is-fullwidth" on:click={() => downloadGeoJSON()}>
					<Fa icon={faDownload} scale={1} />
					<div style="padding-left:5px;">GeoJSON</div>
				</button>
			</div>
		</div>
	{/if}
{/if}

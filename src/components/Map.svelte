<script lang="ts">
	import { onMount } from 'svelte';
	import maplibregl, {
		Map,
		NavigationControl,
		GeolocateControl,
		ScaleControl,
		AttributionControl,
		type GeoJSONSourceSpecification
	} from 'maplibre-gl';
	import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
	import { map, selectedStyle, queriedFeatures } from '../stores';
	import { config } from '../config';
	import MaplibreIdentifyTools from '../lib/IdentifyTools';

	let mapContainer: HTMLDivElement;
	let centerMarker: GeoJSONSourceSpecification;

	onMount(async () => {
		const map2 = new Map({
			container: mapContainer,
			style: $selectedStyle.uri,
			center: config.center,
			zoom: config.zoom,
			hash: true,
			attributionControl: false
		});
		map2.addControl(new NavigationControl({}), 'top-right');
		map2.addControl(
			new GeolocateControl({
				positionOptions: { enableHighAccuracy: true },
				trackUserLocation: true
			}),
			'top-right'
		);
		map2.addControl(new ScaleControl({ maxWidth: 80, unit: 'metric' }), 'bottom-left');
		map2.addControl(new AttributionControl({ compact: true }), 'bottom-right');

		map2.addControl(
			new MaplibreIdentifyTools(config.popup.target, (features) => {
				queriedFeatures.update(() => features);
			})
		);

		if (config.elevation) {
			const MapboxElevationControl = await (
				await import('@watergis/maplibre-gl-elevation')
			).default;
			map2.addControl(
				new MapboxElevationControl(config.elevation.url, config.elevation.options),
				'top-right'
			);
		}

		const { MaplibreExportControl, Size, PageOrientation, Format, DPI } = await import(
			'@watergis/maplibre-gl-export'
		);
		map2.addControl(
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			new MaplibreExportControl({
				PageSize: Size.A4,
				PageOrientation: PageOrientation.Landscape,
				Format: Format.PNG,
				DPI: DPI[96],
				Crosshair: true,
				PrintableArea: true
			}),
			'top-right'
		);

		if (!config.search) return;
		const customerData = await fetch(config.search.url).then((res) => res.json());
		function forwardGeocoder(query) {
			var matchingFeatures = [];
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			for (var i = 0; i < customerData.features.length; i++) {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				var feature = customerData.features[i];
				config.search.target.forEach((v) => {
					var target = feature.properties[v];
					if (!target) {
						return;
					}
					// handle queries with different capitalization than the source data by calling toLowerCase()
					if (target.toString().toLowerCase().search(query.toString().toLowerCase()) !== -1) {
						feature['place_name'] = config.search.format(feature.properties);
						feature['center'] = feature.geometry.coordinates;
						feature['place_type'] = config.search.place_type;
						matchingFeatures.push(feature);
					}
				});
			}
			return matchingFeatures;
		}
		map2.addControl(
			new MapboxGeocoder({
				localGeocoder: forwardGeocoder,
				localGeocoderOnly: true,
				zoom: config.search.zoom,
				placeholder: config.search.placeholder,
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				mapboxgl: maplibregl
			}),
			'top-left'
		);

		const loadCenterIcon = () => {
			map2.loadImage(`${config.basePath}/map-center.png`, (error, image) => {
				if (error) throw error;
				map2.addImage('map-center', image);
				centerMarker = {
					type: 'geojson',
					data: {
						type: 'FeatureCollection',
						features: [
							{
								type: 'Feature',
								geometry: {
									type: 'Point',
									coordinates: [map2.getCenter().lng, map2.getCenter().lat]
								}
							}
						]
					}
				};
				map2.addSource('center', centerMarker);
				map2.addLayer({
					id: 'points',
					type: 'symbol',
					source: 'center', // reference the data source
					layout: {
						'icon-image': 'map-center', // reference the image
						'icon-size': 0.3
					}
				});
			});
		};

		// show icon at the center of map
		map2.on('load', () => {
			loadCenterIcon();
			map2.on('moveend', () => {
				const source = map2.getSource('center');
				if (source) {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					centerMarker.data.features[0].geometry.coordinates = [
						map2.getCenter().lng,
						map2.getCenter().lat
					];
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					map2.getSource('center').setData(centerMarker.data);
				} else {
					loadCenterIcon();
				}
			});
		});

		map.update(() => map2);
	});
</script>

<div class="map-wrap">
	<div class="map" id="map" bind:this={mapContainer} />
</div>

<style>
	@import 'maplibre-gl/dist/maplibre-gl.css';
	@import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
	@import '@watergis/maplibre-gl-export/css/styles.css';
	@import '@watergis/maplibre-gl-elevation/css/styles.css';
	@import '../css/IdentifyTools.css';

	.map-wrap {
		position: relative;
		width: 100%;
		height: calc(100vh - 64px);
	}
	.map {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
	}
</style>

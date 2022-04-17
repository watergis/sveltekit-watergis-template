<script lang="ts">
	import { onMount } from 'svelte';
	import maplibregl, {
		Map,
		NavigationControl,
		GeolocateControl,
		ScaleControl,
		AttributionControl
	} from 'maplibre-gl';
	import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
	import MapboxAreaSwitcherControl from '@watergis/mapbox-gl-area-switcher';
	import MapboxPopupControl from '@watergis/mapbox-gl-popup';
	import { MapboxStyleSwitcherControl } from '@watergis/mapbox-gl-style-switcher';
	import { MapboxValhallaControl } from '@watergis/mapbox-gl-valhalla';
	import { config } from '../config';

	let map: Map;
	let mapContainer: HTMLDivElement;

	onMount(async () => {
		map = new Map({
			container: mapContainer,
			style: config.styles[0].uri,
			center: config.center,
			zoom: config.zoom,
			hash: true,
			attributionControl: false
		});
		map.addControl(new NavigationControl({}), 'top-right');
		map.addControl(
			new GeolocateControl({
				positionOptions: { enableHighAccuracy: true },
				trackUserLocation: true
			}),
			'top-right'
		);
		map.addControl(new ScaleControl({ maxWidth: 80, unit: 'metric' }), 'bottom-left');
		map.addControl(new AttributionControl({ compact: true }), 'bottom-right');
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		map.addControl(new MapboxStyleSwitcherControl(config.styles), 'top-right');
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		map.addControl(new MapboxAreaSwitcherControl(config.areaSwitcher.areas), 'top-right');

		if (config.elevation) {
			const MapboxElevationControl = await (
				await import('@watergis/maplibre-gl-elevation')
			).default;
			map.addControl(
				new MapboxElevationControl(config.elevation.url, config.elevation.options),
				'top-right'
			);
		}

		const { MaplibreExportControl, Size, PageOrientation, Format, DPI } = await import(
			'@watergis/maplibre-gl-export'
		);
		map.addControl(
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

		if (config.valhalla)
			map.addControl(
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				new MapboxValhallaControl(config.valhalla.url, config.valhalla.options),
				'top-right'
			);

		if (config.legend) {
			const { MaplibreLegendControl } = await import('@watergis/maplibre-gl-legend');
			map.addControl(
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				//@ts-ignore
				new MaplibreLegendControl(config.legend.targets, config.legend.options),
				'bottom-left'
			);
		}

		if (config.popup) map.addControl(new MapboxPopupControl(config.popup.target));

		if (!config.search) return;
		fetch(config.search.url)
			.then((res) => res.json())
			.then((data) => {
				const customerData = data;
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
				map.addControl(
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
			});
	});
</script>

<div class="map" id="map" bind:this={mapContainer} />

<style>
	@import 'maplibre-gl/dist/maplibre-gl.css';
	@import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
	@import '@watergis/maplibre-gl-export/css/styles.css';
	@import '@watergis/maplibre-gl-legend/css/styles.css';
	@import '@watergis/maplibre-gl-elevation/css/styles.css';
	@import '@watergis/mapbox-gl-valhalla/css/styles.css';
	@import '@watergis/mapbox-gl-style-switcher/styles.css';
	@import '@watergis/mapbox-gl-area-switcher/css/styles.css';
	@import '@watergis/mapbox-gl-popup/css/styles.css';

	.map {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 100%;
		z-index: 1;
	}
</style>

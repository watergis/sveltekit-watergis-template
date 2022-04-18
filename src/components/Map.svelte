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
	import { map, spriteImage } from '../stores';
	import type { sprite } from '../lib/types';
	import { config } from '../config';

	let mapContainer: HTMLDivElement;

	onMount(async () => {
		const map2 = new Map({
			container: mapContainer,
			style: config.styles[0].uri,
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
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		map2.addControl(new MapboxStyleSwitcherControl(config.styles), 'top-right');
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		map2.addControl(new MapboxAreaSwitcherControl(config.areaSwitcher.areas), 'top-right');

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

		if (config.valhalla)
			map2.addControl(
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				new MapboxValhallaControl(config.valhalla.url, config.valhalla.options),
				'top-right'
			);

		if (config.legend) {
			const { MaplibreLegendControl } = await import('@watergis/maplibre-gl-legend');
			map2.addControl(
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				//@ts-ignore
				new MaplibreLegendControl(config.legend.targets, config.legend.options),
				'bottom-left'
			);
		}

		if (config.popup) map2.addControl(new MapboxPopupControl(config.popup.target));

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

		map2.on('load', () => {
			const styleUrl = map2.getStyle().sprite;
			const promise = Promise.all([
				loadImage(`${styleUrl}@4x.png`),
				fetchUrl(`${styleUrl}@4x.json`)
			]);
			promise
				.then(([image, json]) => {
					const sprite: sprite = {
						image: image,
						json: json
					};
					return sprite;
				})
				.then((sprite: sprite) => {
					spriteImage.update(() => sprite);
				});
		});

		map.update(() => map2);
	});

	const loadImage = (url: string): Promise<HTMLImageElement> => {
		let cancelled = false;
		const promise = new Promise<HTMLImageElement>((resolve, reject) => {
			const img = new Image();
			img.crossOrigin = 'Anonymous';
			img.onload = () => {
				if (!cancelled) resolve(img);
			};
			img.onerror = (e) => {
				if (!cancelled) reject(e);
			};
			img.src = url;
		});
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		promise.cancel = () => {
			cancelled = true;
		};
		return promise;
	};

	const fetchUrl = async (url: string) => {
		const response = await fetch(url);
		return response.json();
	};
</script>

<div class="map-wrap">
	<div class="map" id="map" bind:this={mapContainer} />
</div>

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

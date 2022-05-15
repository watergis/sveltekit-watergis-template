<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Map,
		NavigationControl,
		GeolocateControl,
		ScaleControl,
		AttributionControl,
		FullscreenControl,
		type GeoJSONSourceSpecification
	} from 'maplibre-gl';
	import { map, selectedStyle, queriedFeatures } from '../stores';
	import { config } from '../config';
	import MaplibreIdentifyTools from '$lib/IdentifyTools';
	import StyleUrl from '$lib/style-url';

	let mapContainer: HTMLDivElement;
	let centerMarker: GeoJSONSourceSpecification;

	onMount(async () => {
		const styleUrlObj = new StyleUrl();
		const defaultStyle = config.styles[0];
		const styleFromUrl = styleUrlObj.get();
		let initialStyle = defaultStyle;
		if (styleFromUrl) {
			const styleObj = styleUrlObj.getMatchedStyleByTitle(config.styles, styleFromUrl);
			if (styleObj) {
				initialStyle = styleObj;
			}
		}
		selectedStyle.update(() => initialStyle);

		const map2 = new Map({
			container: mapContainer,
			style: initialStyle.uri,
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
		map2.addControl(new FullscreenControl({ container: document.querySelector('body') }));
		map2.addControl(new ScaleControl({ maxWidth: 80, unit: 'metric' }), 'bottom-left');
		map2.addControl(new AttributionControl({ compact: true }), 'bottom-right');

		map2.addControl(
			new MaplibreIdentifyTools(config.popup.target, (features) => {
				queriedFeatures.update(() => features);
			})
		);

		const loadCenterIcon = () => {
			map2.loadImage(`${config.basePath}/map-center.png`, (error, image) => {
				if (error) throw error;
				if (!map2.hasImage('map-center')) {
					map2.addImage('map-center', image);
				}

				if (!map2.getSource('center')) {
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
				}
				if (!map2.getLayer('points')) {
					map2.addLayer({
						id: 'points',
						type: 'symbol',
						source: 'center', // reference the data source
						layout: {
							'icon-image': 'map-center', // reference the image
							'icon-size': 0.3
						}
					});
				}
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

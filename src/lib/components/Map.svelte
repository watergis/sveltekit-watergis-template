<script lang="ts">
	import { onMount } from 'svelte';
	import maplibregl, {
		Map,
		NavigationControl,
		GeolocateControl,
		ScaleControl,
		AttributionControl,
		FullscreenControl,
		TerrainControl
	} from 'maplibre-gl';
	import { map, selectedStyle } from '$lib/stores';
	import { config } from '$config';
	import MapboxAreaSwitcherControl from '@watergis/mapbox-gl-area-switcher';
	import AttributePopupControl from '@watergis/svelte-maplibre-attribute-popup';
	import { MapExportControl } from '@watergis/svelte-maplibre-export';
	import { ShareURLControl } from '@watergis/svelte-maplibre-share';
	import { MenuControl } from '@watergis/svelte-maplibre-menu';
	import DrawerContent from './DrawerContent.svelte';
	import { StyleUrl } from '@watergis/svelte-maplibre-style-switcher';
	import CenterIconManager from '@watergis/maplibre-center-icon';
	import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
	import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

	let mapContainer: HTMLDivElement;
	let isMenuShown = false;
	let isInitialising: Promise<void>;

	const styleUrlObj = new StyleUrl();
	const initialStyle = styleUrlObj.getInitialStyle(config.styles);
	selectedStyle.update(() => initialStyle);

	const initialise = () => {
		if (!mapContainer) return;
		return new Promise<void>((resolve) => {
			$map = new Map({
				container: mapContainer,
				style: initialStyle.uri,
				center: config.center,
				zoom: config.zoom,
				hash: true,
				attributionControl: false
			});

			$map.addControl(new AttributionControl({ compact: true }), 'bottom-right');

			$map.addControl(
				new GeolocateControl({
					positionOptions: { enableHighAccuracy: true },
					trackUserLocation: true
				}),
				'bottom-right'
			);

			$map.addControl(
				new NavigationControl({
					visualizePitch: true,
					showZoom: true,
					showCompass: true
				}),
				'bottom-right'
			);

			if (config.terrain) {
				$map.setMaxPitch(85);
				$map.addControl(new TerrainControl(config.terrain), 'bottom-right');
			}

			if (config.areaSwitcher) {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				$map.addControl(new MapboxAreaSwitcherControl(config.areaSwitcher.areas), 'bottom-right');
			}

			$map.addControl(
				new FullscreenControl({ container: document.querySelector('body') }),
				'bottom-right'
			);

			$map.addControl(new ScaleControl({ maxWidth: 80, unit: 'metric' }), 'bottom-left');

			const centerIconManager = new CenterIconManager($map);
			centerIconManager.create();

			if (config.search) {
				fetch(config.search.url)
					.then((res) => res.json())
					.then((data) => {
						function forwardGeocoder(query) {
							var matchingFeatures = [];
							for (var i = 0; i < data.features.length; i++) {
								var feature = data.features[i];
								config.search.target.forEach((v) => {
									var target = feature.properties[v];
									if (!target) {
										return;
									}
									// handle queries with different capitalization than the source data by calling toLowerCase()
									if (
										target.toString().toLowerCase().search(query.toString().toLowerCase()) !== -1
									) {
										feature['place_name'] = config.search.format(feature.properties);
										feature['center'] = feature.geometry.coordinates;
										feature['place_type'] = config.search.place_type;
										matchingFeatures.push(feature);
									}
								});
							}
							return matchingFeatures;
						}
						$map.addControl(
							new MapboxGeocoder({
								// accessToken: mapboxgl.accessToken,
								localGeocoder: forwardGeocoder,
								localGeocoderOnly: true,
								zoom: config.search.zoom,
								placeholder: config.search.placeholder,
								limit: config.search.limit,
								mapboxgl: maplibregl,
								collapsed: true
							}),
							'top-left'
						);
					});
			}

			$map.on('load', () => {
				resolve();
			});
		});
	};

	let customiseUrl = (url: string): string => {
		const _url = new URL(url);
		_url.searchParams.set('style', $selectedStyle.title);
		return _url.toString();
	};

	onMount(() => {
		isInitialising = initialise();
	});
</script>

<MenuControl bind:map={$map} position={'top-right'} bind:isMenuShown>
	<div slot="sidebar">
		<DrawerContent />
	</div>
	<div slot="map">
		<div class="map" id="map" bind:this={mapContainer} />
		{#await isInitialising then}
			<AttributePopupControl bind:map={$map} bind:targetLayers={config.popup.target} />
			<ShareURLControl bind:map={$map} bind:customiseUrl position="top-right" />
			<MapExportControl
				bind:map={$map}
				showPrintableArea={true}
				showCrosshair={true}
				position="top-right"
			/>
		{/await}
	</div>
</MenuControl>

<style>
	@import 'maplibre-gl/dist/maplibre-gl.css';
	@import '@watergis/mapbox-gl-area-switcher/css/styles.css';

	.map {
		position: absolute;
		top: 0;
		bottom: 0;
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
	}

	:global(.mapboxgl-ctrl-geocoder .suggestions) {
		overflow-y: auto !important;
		max-height: calc(85vh);
	}
</style>

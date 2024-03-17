<script lang="ts">
	import { page } from '$app/stores';
	import { config } from '$config';
	import { map, selectedStyle } from '$lib/stores';
	import MaplibreGeocoder from '@maplibre/maplibre-gl-geocoder';
	import '@maplibre/maplibre-gl-geocoder/lib/maplibre-gl-geocoder.css';
	import CenterIconManager from '@watergis/maplibre-center-icon';
	import MaplibreAreaSwitcherControl from '@watergis/maplibre-gl-area-switcher';
	import '@watergis/maplibre-gl-area-switcher/dist/maplibre-gl-area-switcher.css';
	import { MaplibreTourControl } from '@watergis/maplibre-gl-tour';
	import AttributePopupControl from '@watergis/svelte-maplibre-attribute-popup';
	import AttributeTableControl from '@watergis/svelte-maplibre-attribute-table';
	import { MapExportControl } from '@watergis/svelte-maplibre-export';
	import { MenuControl } from '@watergis/svelte-maplibre-menu';
	import { ShareURLControl } from '@watergis/svelte-maplibre-share';
	import { StyleUrl } from '@watergis/svelte-maplibre-style-switcher';
	import maplibregl, {
		AttributionControl,
		GeolocateControl,
		Map,
		NavigationControl,
		ScaleControl,
		TerrainControl,
		addProtocol
	} from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import { Protocol } from 'pmtiles';
	import { onMount } from 'svelte';
	import DrawerContent from './DrawerContent.svelte';

	let mapContainer: HTMLDivElement;
	let isMenuShown = false;
	let isInitialising: Promise<void>;
	let mapContainerWidth: number;
	let mapContainerHeight: number;

	const styleUrlObj = new StyleUrl();
	const initialStyle = styleUrlObj.getInitialStyle(config.styles);
	selectedStyle.update(() => initialStyle);

	const initialise = async () => {
		const protocol = new Protocol();
		addProtocol('pmtiles', protocol.tile);

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
			$map.addControl(new MaplibreAreaSwitcherControl(config.areaSwitcher.areas), 'bottom-right');
		}

		$map.addControl(new ScaleControl({ maxWidth: 80, unit: 'metric' }), 'bottom-left');

		const centerIconManager = new CenterIconManager($map);
		centerIconManager.create();

		if (config.search) {
			fetch(config.search.url)
				.then((res) => res.json())
				.then((data) => {
					const forwardGeocoder = async (query) => {
						var matchingFeatures = [];
						for (var i = 0; i < data.features.length; i++) {
							var feature = data.features[i];
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
					};

					var geocoder_api = {
						forwardGeocode: async ({ query }) => {
							return {
								features: await forwardGeocoder(query)
							};
						}
					};

					$map.addControl(
						new MaplibreGeocoder(geocoder_api, {
							zoom: config.search.zoom,
							placeholder: config.search.placeholder,
							limit: config.search.limit,
							maplibregl: maplibregl,
							collapsed: true,
							showResultsWhileTyping: true
						}),
						'top-left'
					);
				});
		}

		$map.once('load', () => {
			const tourControl = getTourControl();
			$map.addControl(tourControl, 'top-right');
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

	const onChange = (e: { detail: { secondarySize: number } }) => {
		mapContainerWidth = e.detail.secondarySize;
	};

	const getTourControl = () => {
		const steps = config.tour.tourGuideOptions.steps;
		steps[0].target = document.body;

		if (!config.areaSwitcher) {
			steps.splice(
				steps.findIndex((s) => s.target === '.maplibregl-area-switcher'),
				1
			);
		}

		if (!config.terrain) {
			steps.splice(
				steps.findIndex((s) => s.target === '.maplibregl-ctrl-terrain'),
				1
			);
		}

		steps.forEach((step, index) => {
			step.order = index + 1;
		});

		config.tour.tourControlOptions.localStorageKey =
			config.tour.tourControlOptions.localStorageKey.replace('{url}', $page.url.origin);

		return new MaplibreTourControl(config.tour.tourGuideOptions, config.tour.tourControlOptions);
	};
</script>

<svelte:window bind:innerHeight={mapContainerHeight} />

<MenuControl bind:map={$map} position={'top-right'} bind:isMenuShown on:changed={onChange}>
	<div slot="sidebar">
		<DrawerContent />
	</div>
	<div slot="map">
		<AttributeTableControl
			bind:map={$map}
			position="top-right"
			rowsPerPage={config.attributeTable.rowsPerPage}
			minZoom={config.attributeTable.minZoom}
			bind:width={mapContainerWidth}
			bind:height={mapContainerHeight}
		>
			<div class="map" id="map" bind:this={mapContainer} />
		</AttributeTableControl>
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
	@import '@sjmc11/tourguidejs/dist/css/tour.min.css';
	@import '@watergis/maplibre-gl-tour/dist/maplibre-tour-control.css';

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

	:global(button.tg-dialog-btn) {
		cursor: pointer;
	}
</style>

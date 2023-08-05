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
	import 'maplibre-gl/dist/maplibre-gl.css';
	import * as pmtiles from 'pmtiles';
	import { map, selectedStyle } from '$lib/stores';
	import { config } from '$config';
	import MaplibreAreaSwitcherControl from '@watergis/maplibre-gl-area-switcher';
	import '@watergis/maplibre-gl-area-switcher/dist/maplibre-gl-area-switcher.css';
	import AttributePopupControl from '@watergis/svelte-maplibre-attribute-popup';
	import { MapExportControl } from '@watergis/svelte-maplibre-export';
	import { ShareURLControl } from '@watergis/svelte-maplibre-share';
	import { MenuControl } from '@watergis/svelte-maplibre-menu';
	import DrawerContent from './DrawerContent.svelte';
	import { StyleUrl } from '@watergis/svelte-maplibre-style-switcher';
	import CenterIconManager from '@watergis/maplibre-center-icon';
	import MaplibreGeocoder from '@maplibre/maplibre-gl-geocoder';
	import '@maplibre/maplibre-gl-geocoder/lib/maplibre-gl-geocoder.css';
	import AttributeTableControl from '@watergis/svelte-maplibre-attribute-table';
	import type TourGuideOptions from '@sjmc11/tourguidejs/src/core/options';
	import TourControl from './TourControl.svelte';
	// import '@sjmc11/tourguidejs/src/scss/tour.scss'; // Styles
	// import { TourGuideClient } from '@sjmc11/tourguidejs/src/Tour';

	let protocol = new pmtiles.Protocol();
	maplibregl.addProtocol('pmtiles', protocol.tile);

	let mapContainer: HTMLDivElement;
	let isMenuShown = false;
	let isInitialising: Promise<void>;
	let mapContainerWidth: number;
	let mapContainerHeight: number;

	const styleUrlObj = new StyleUrl();
	const initialStyle = styleUrlObj.getInitialStyle(config.styles);
	selectedStyle.update(() => initialStyle);

	let tourOptions: TourGuideOptions;
	let mapTourName = 'mapTour';

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
				$map.addControl(new MaplibreAreaSwitcherControl(config.areaSwitcher.areas), 'bottom-right');
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

			$map.on('load', () => {
				resolve();

				setTimeout(() => {
					const topRightTools = document.querySelectorAll(
						'.maplibregl-ctrl-top-right .maplibregl-ctrl'
					);

					const menuButton = topRightTools.item(0);
					const attributeTableButton = topRightTools.item(1);
					const shareButton = topRightTools.item(2);
					const queryButton = topRightTools.item(3);
					const exportButton = topRightTools.item(4);

					const topLeftTools = document.querySelectorAll(
						'.maplibregl-ctrl-top-left .maplibregl-ctrl'
					);
					const searchButton = topLeftTools.item(0);

					const steps = [
						{
							title: 'Welcome to sveltekit watergis template!',
							content: `This tutorial is going to take you around the main features of the application. <br> Let's begin!`,
							target: document.body,
							group: mapTourName,
							order: 1
						},
						{
							title: 'Geospatial analytics tools',
							content:
								'Click this button to start analysing the datasets.<br><br>In the Layers tab, you can switch base maps either OSM or aerial, and can toggle layer visibility. <br><br>In Advanced tab, there are line measuring tool, routing tool and isochrone analysis tool.',
							target: menuButton,
							group: mapTourName,
							order: 2
						},
						{
							title: 'Attribute table tool',
							content:
								'Click this button to start exploring attributes data of selected layer. You can also filter the data by keyword, and sort them, zoom and pan it.',
							target: attributeTableButton,
							group: mapTourName,
							order: 3
						},
						{
							title: 'Sharing tool',
							content:
								'This button enables you to copy and share URL of current map with your colleagues.',
							target: shareButton,
							group: mapTourName,
							order: 4
						},
						{
							title: 'Query tool',
							content:
								'This button enables you to query details information of selected features on the map',
							target: queryButton,
							group: mapTourName,
							order: 5
						},
						{
							title: 'Export tool',
							content: `This button enables you to export images with your preferences.<br>You can choose file size, image format (png, jpeg, pdf and svg), and DPI resolution, orientation of the exported image`,
							target: exportButton,
							group: mapTourName,
							order: 6
						},
						{
							title: 'Search features',
							content: `You can search features by typing keywords from here.`,
							target: searchButton,
							group: mapTourName,
							order: 7
						}
					];

					steps.push({
						title: 'Done!',
						content: `The tour has been completed now. Click Finish button to start using it! Thank you for taking your time to use this tool!<br><br>You can come back to this tour anytime by clicking the question mark button.`,
						target: document.body,
						group: mapTourName,
						order: steps.length + 1
					});

					tourOptions = { steps, rememberStep: true };
				}, 300);
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

	const onChange = (e: { detail: { secondarySize: number } }) => {
		mapContainerWidth = e.detail.secondarySize;
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

			{#if tourOptions}
				<TourControl bind:map={$map} bind:tourguideOptions={tourOptions} bind:group={mapTourName} />
			{/if}
		{/await}
	</div>
</MenuControl>

<style>
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

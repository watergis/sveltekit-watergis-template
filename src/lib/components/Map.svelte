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
	import TourControl, { type TourGuideOptions } from '@watergis/svelte-maplibre-tour';

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

					const steps = [
						{
							title: 'Welcome to sveltekit watergis template!',
							content: `This tutorial is going to take you around the main features of the application. <br> Let's begin!`,
							target: document.body,
							order: 1
						},
						{
							title: 'Geospatial analytics tools',
							content: `
								<div style="max-height: 300px; overflow-y: auto">
								Click this button to start analysing the datasets.
								<br><br>
								In the <b>Layers</b> tab, 
								<br>
								<img src="/assets/tutorial/style-switcher.png" height="32px"/>
								firstly you can switch base maps either OSM or aerial from the below select box.
								<br>
								<img src="/assets/tutorial/eye-solid.svg" width="24px"/>
								<br>
								You can also switch layer visibility by clicking this button.
								<br>
								<img src="/assets/tutorial/palette-solid.svg" width="24px"/>
								<br>
								From the above palette button, you can edit layer style as you want.
								<br><br>
								In <b>Advanced</b> tab, there are three main features:
								<br>
								<b>1) measuring tool</b>: 
								<br>
								<img src="/assets/tutorial/measure-tool.png" width="100%"/>
								<br>
								Click "Start measure" button, then click locations on the map to query the distance and altitude.
								<br>
								<br>
								<b>2) routing tool</b>;
								<br>
								<img src="/assets/tutorial/routing-tool.png" width="100%"/>
								<br>
								Click "Start routing" button, then you can calculate the shortest route by clicking on the route on the map with your prefered means of transport.
								<br>
								<br>
								<b>3)isochrone analysis tool</b>.
								<br>
								<img src="/assets/tutorial/isochrone-tool.png" width="100%"/>
								<br>Isochrone is a very powerful tool to estimate contours by certain time or distance by selected transport option. It can be used for some SDG indicator such as "Water access within 30 minute round trip".
								<br>
								<img src="/assets/tutorial/isochrone-example.png" width="100%"/>
								</div>
								`,
							target: menuButton,
							order: 2
						},
						{
							title: 'Attribute table tool',
							content: `<div style="max-height: 300px; overflow-y: auto">
								Click this button to start exploring attributes data of selected layer. 
								You can also filter the data by keyword, and sort them, zoom to the select feature.
								<br>
								<img src="/assets/tutorial/attr-table-selectbox.png" width="100%"/>
								<br>
								Firstly, select a layer to show attribute table. The table will show all records within current map extent. Please refresh table if you move map.
								<br>
								<img src="/assets/tutorial/magnifying-glass-plus-solid.svg" width="24px"/>
								<br>
								You can zoom to selected feature by clicking the above button.
								<br>
								<img src="/assets/tutorial/up-down-left-right-solid.svg" width="24px"/>
								<br>
								You can pan to selected feature by clicking the above button.
								</div>`,
							target: attributeTableButton,
							order: 3
						},
						{
							title: 'Sharing tool',
							content:
								'This button enables you to copy and share URL of current map with your colleagues.',
							target: shareButton,
							order: 4
						},
						{
							title: 'Query tool',
							content: `This button enables you to query details information of selected features on the map. If the tool is enabled, you can click the feature on the map to enquiry details information.`,
							target: queryButton,
							order: 5
						},
						{
							title: 'Export tool',
							content: `This button enables you to export images with your preferences.<br>You can choose file size, image format (png, jpeg, pdf and svg), and DPI resolution, orientation of the exported image`,
							target: exportButton,
							order: 6
						},
						{
							title: 'Search features',
							content: `You can search features by typing keywords from the searching box.`,
							target: '.maplibregl-ctrl-geocoder',
							order: 7
						}
					];

					const areaSwitcher = document.getElementsByClassName('maplibregl-area-switcher');
					if (areaSwitcher.length > 0) {
						steps.push({
							title: 'Area switching tool',
							content: `You can switch the map to the selected area instantly.`,
							target: '.maplibregl-area-switcher',
							order: steps.length + 1
						});
					}

					const terrainControl = document.getElementsByClassName('maplibregl-ctrl-terrain');
					if (terrainControl.length > 0) {
						steps.push({
							title: 'Terrain tool',
							content: `If this is enabled, 3D terrain landscape will be shown. In order to use this, you can tilt the map by holding right-click (mouse) or two fingers (smartphone or tablet)`,
							target: '.maplibregl-ctrl-terrain',
							order: steps.length + 1
						});
					}

					steps.push({
						title: 'GNSS positioning tool',
						content: `GNSS positioning your current location is available by clicking this button.`,
						target: '.maplibregl-ctrl-geolocate',
						order: steps.length + 1
					});

					tourOptions = { steps, rememberStep: true, autoScroll: false };
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
				<TourControl bind:map={$map} bind:tourguideOptions={tourOptions} />
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

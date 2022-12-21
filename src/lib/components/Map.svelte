<script lang="ts">
	import { onMount } from 'svelte';
	import {
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
	import SearchControl from '@watergis/svelte-maplibre-search';
	import MapboxAreaSwitcherControl from '@watergis/mapbox-gl-area-switcher';
	import AttributePopupControl from '@watergis/svelte-maplibre-attribute-popup';
	import { MapExportControl } from '@watergis/svelte-maplibre-export';
	import { ShareURLControl } from '@watergis/svelte-maplibre-share';
	import { MenuControl } from '@watergis/svelte-maplibre-menu';
	import DrawerContent from './DrawerContent.svelte';
	import { StyleUrl } from '@watergis/svelte-maplibre-style-switcher';
	import CenterIconManager from '@watergis/maplibre-center-icon';

	let mapContainer: HTMLDivElement;
	let isMapLoaded = false;
	let isMenuShown = false;

	const styleUrlObj = new StyleUrl();
	const initialStyle = styleUrlObj.getInitialStyle(config.styles);
	selectedStyle.update(() => initialStyle);

	onMount(() => {
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

		$map.on('load', () => {
			isMapLoaded = true;
		});
	});

	let customiseUrl = (url: string): string => {
		const _url = new URL(url);
		_url.searchParams.set('style', $selectedStyle.title);
		return _url.toString();
	};
</script>

<MenuControl bind:map={$map} position={'top-right'} bind:isMenuShown>
	<div slot="primary">
		<DrawerContent />
	</div>
	<div slot="secondary">
		<div class="map" id="map" bind:this={mapContainer} />
		{#if isMapLoaded && config.search}
			<SearchControl bind:map={$map} bind:searchOption={config.search} position="top-left" />
		{/if}
		<AttributePopupControl bind:map={$map} bind:targetLayers={config.popup.target} />
		<ShareURLControl bind:map={$map} bind:customiseUrl position="top-right" />
		<MapExportControl
			bind:map={$map}
			showPrintableArea={true}
			showCrosshair={true}
			position="top-right"
		/>
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
</style>

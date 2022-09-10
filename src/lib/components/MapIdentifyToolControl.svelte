<script lang="ts">
	import { onMount } from 'svelte';
	import type { Map, MapMouseEvent } from 'maplibre-gl';
	import { queriedFeatures } from '$lib/stores';
	import { config } from '../../config';
	export let map: Map;

	let mapIdentifyToolControl = null;

	$: {
		if (map) {
			if (mapIdentifyToolControl !== null && map.hasControl(mapIdentifyToolControl) === false) {
				map.addControl(mapIdentifyToolControl, 'top-right');
			}
		}
	}

	// eslint-disable-next-line
	function MapIdentifyToolControl() {}

	MapIdentifyToolControl.prototype.onAdd = function (map: Map) {
		this.map = map;

		this.controlContainer = document.createElement('div');
		this.controlContainer.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
		this.button = document.createElement('button');
		this.button.className = 'maplibre-identify-icon';
		this.button.type = 'button';
		this.button.addEventListener('click', () => {
			this.changeButtonCondition();
		});
		this.controlContainer.appendChild(this.button);
		this.button.dispatchEvent(new Event('click'));
		return this.controlContainer;
	};

	MapIdentifyToolControl.prototype.changeButtonCondition = function () {
		if (this.isActive) {
			this.button.classList.remove('-active');
			this.isActive = false;
			this.map.off('click', this.onClick.bind(this));
			queriedFeatures.update(() => []);
		} else {
			this.button.classList.add('-active');
			this.isActive = true;
			this.map.on('click', this.onClick.bind(this));
		}
	};

	MapIdentifyToolControl.prototype.onClick = function (e: MapMouseEvent) {
		if (!this.isActive) {
			queriedFeatures.update(() => []);
			return;
		}
		const layers = [];
		config.popup.target.forEach((layer) => {
			if (this.map.getLayer(layer)) {
				layers.push(layer);
			}
		});
		const features = this.map.queryRenderedFeatures(e.point, { layers });
		for (let i = 0; i < features.length; i++) {
			features[i]['open'] = i === 0 ? true : false;
		}
		queriedFeatures.update(() => features);
		return;
	};

	MapIdentifyToolControl.prototype.onRemove = function () {
		if (!this.controlContainer || !this.controlContainer.parentNode || !this.map || !this.button) {
			return;
		}
		this.controlContainer.parentNode.removeChild(this.controlContainer);
		this.map.off('click', this.onClick.bind(this));
		this.map = undefined;
	};

	onMount(async () => {
		mapIdentifyToolControl = new MapIdentifyToolControl();
	});
</script>

<style lang="scss">
	/* a style for terrain rgb detector button */
	:global(.maplibre-identify-icon) {
		background: url('data:image/svg+xml;charset=UTF-8,<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"><g><g><path d="M256,0C114.497,0,0,114.507,0,256c0,141.503,114.507,256,256,256c141.503,0,256-114.507,256-256 C512,114.497,397.492,0,256,0z M256,472c-119.393,0-216-96.615-216-216c0-119.393,96.615-216,216-216 c119.393,0,216,96.615,216,216C472,375.393,375.384,472,256,472z"/></g></g><g><g><path d="M256,214.33c-11.046,0-20,8.954-20,20v128.793c0,11.046,8.954,20,20,20s20-8.955,20-20.001V234.33 C276,223.284,267.046,214.33,256,214.33z"/></g></g><g><g><circle cx="256" cy="162.84" r="27"/></g></g></svg>');
		background-position: center;
		background-repeat: no-repeat;
		background-size: 70%;
	}

	:global(.maplibre-identify-icon.-active) {
		background-color: #ffae00;
	}
</style>

<script lang="ts">
	import AutoComplete from 'simple-svelte-autocomplete';
	import pkg from 'maplibre-gl';
	import { createEventDispatcher } from 'svelte';
	const { Marker } = pkg;
	import { config } from '../config';
	import { map } from '../stores';

	const dispatch = createEventDispatcher();
	let searchItems = [];
	let searchObject = {};
	let selectedObject = {};
	let markerSearch;
	$: selectedObject, zoomToSearchedObject();
	const zoomToSearchedObject = () => {
		if (!(searchObject && Object.keys(searchObject).length > 0)) return;
		if (!(selectedObject && Object.keys(selectedObject).length > 0 && selectedObject['key']))
			return;
		const f = searchObject[selectedObject['key']];
		if (!f) return;
		const coordinates = f.geometry.coordinates;
		$map.flyTo({ center: coordinates, zoom: config.search.zoom, curve: 1 });

		if (markerSearch) {
			markerSearch.remove();
			markerSearch = null;
		}
		markerSearch = new Marker({
			draggable: true
		})
			.setLngLat(coordinates)
			.addTo($map);

		dispatch('zoomed');
	};

	let onChange = () => {
		if (!selectedObject) {
			if (markerSearch) {
				markerSearch.remove();
				markerSearch = null;
			}
		}
	};

	if (config.search) {
		fetch(config.search.url)
			.then((res) => res.json())
			.then((data) => {
				data.features.forEach((feature) => {
					const key = feature.geometry.coordinates.join(',');
					const temp = JSON.parse(JSON.stringify(feature));
					temp.properties = {};
					config.search.target.forEach((t) => {
						if (feature.properties[t]) {
							temp.properties[t] = feature.properties[t];
						}
					});
					if (Object.keys(temp.properties).length === 0) return;
					temp.properties.key = key;
					searchItems.push(temp.properties);
					searchObject[key] = JSON.parse(JSON.stringify(feature));
				});
			});
	}
</script>

{#if config.search}
	<div id="data-container" class="data-container target">
		<AutoComplete
			items={searchItems}
			bind:selectedItem={selectedObject}
			bind:onChange
			placeholder={config.search.placeholder}
			showClear={true}
			showLoadingIndicator={true}
			labelFunction={(properties) => (properties ? config.search.format(properties) : '')}
			maxItemsToShowInList="10"
		/>
	</div>
{/if}

<style lang="scss">
	:global(.autocomplete) {
		width: 100%;
	}

	:global(.autocomplete-input) {
		background-color: #fff;
		border-radius: 10px;
		border: 1px solid #ccc;
		box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.1);
		color: #4a4a4a;
		font-family: ProximaNova, sans-serif;
		font-size: 11px;
		height: 40px !important;
	}

	:global(.autocomplete-list) {
		top: 5px !important;
		background-color: #fff;
		border-radius: 10px;
		border: 1px solid #ccc;
		box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.1);
	}

	.data-container {
		top: 5px;
		left: 5px;
		padding: 10px;
		position: absolute;
		z-index: 10;
	}
</style>

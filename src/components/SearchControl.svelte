<script lang="ts">
	import AutoComplete from 'simple-svelte-autocomplete';
	import pkg from 'maplibre-gl';
	const { Marker } = pkg;
	import { config } from '../config';
	import { map } from '../stores';

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
	<div>
		<AutoComplete
			items={searchItems}
			bind:selectedItem={selectedObject}
			bind:onChange
			placeholder={config.search.placeholder}
			showClear={true}
			showLoadingIndicator={true}
			labelFunction={(properties) => (properties ? config.search.format(properties) : '')}
		/>
	</div>
{/if}

<style lang="scss">
	:global(.autocomplete) {
		width: 100%;
	}
</style>

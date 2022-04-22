<script lang="ts">
	import AutoComplete from 'simple-svelte-autocomplete';
	import { Marker } from 'maplibre-gl';
	import { config } from '../config';
	import { map } from '../stores';

	let searchItems = [];
	let searchObject = {};
	let selectedObject = {};
	let markerSearch: Marker;
	$: selectedObject, zoomToSearchedObject();
	const zoomToSearchedObject = () => {
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
	<div class="search">
		<AutoComplete
			items={searchItems}
			bind:selectedItem={selectedObject}
			labelFunction={(properties) => (properties ? config.search.format(properties) : '')}
		/>
	</div>
{/if}

<style lang="scss">
	.search {
		// padding-left: 1.5em;
		width: 100%;
	}
</style>

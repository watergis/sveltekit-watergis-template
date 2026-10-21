import type { Config } from './lib/types';

export const config: Config = {
	title: 'GIS for Water - Visualise, Analise and Share Water & Sanitation data',
	url: 'https://water-gis.com',
	logo: 'https://raw.githubusercontent.com/watergis/logo/main/logo.svg',
	// basePath: process.env.NODE_ENV === 'production' ? '/sveltekit-watergis-template' : '',
	basePath: '',
	// change attribution to yours
	attribution: '©NARWASSCO',
	// change stylefiles URLs to yours
	styles: [
		{
			title: 'UNVT Water (OSM)',
			uri: `https://narwassco.github.io/mapbox-stylefiles/unvt/style.json`
		},
		{
			title: 'UNVT Water (Building)',
			uri: `https://narwassco.github.io/mapbox-stylefiles/unvt/style-buildings.json`
		},
		{
			title: 'Satellite Water',
			uri: `https://narwassco.github.io/mapbox-stylefiles/unvt/style-aerial.json`
		},
		{
			title: 'UNVT Sewer',
			uri: `https://narwassco.github.io/mapbox-stylefiles/unvt/style-sewer.json`
		},
		{
			title: 'Satellite Sewer',
			uri: `https://narwassco.github.io/mapbox-stylefiles/unvt/style-aerial-sewer.json`
		}
	],
	// change initial location and zoom level to yours
	center: { lng: 35.87063, lat: -1.08551 },
	zoom: 13,
	// you can put your geojson file for searching functions
	search: {
		url: 'https://narwassco.github.io/vt/meter.geojson',
		target: ['connno', 'serialno'],
		format: (p) => {
			return `${p.customer}, ${p.connno}, ${p.serialno}, ${p.village}`;
		},
		place_type: ['meter'],
		placeholder: 'Search CONN NO or S/N',
		zoom: 17,
		limit: 50
	},
	// please specify layers' name for showing popup with attributes table.
	popup: {
		target: [
			'meter',
			'flow meter',
			'valve',
			'washout',
			'firehydrant',
			'tank',
			'pipeline',
			'pg-building',
			'sewer-connection',
			'sewer_commercial',
			'sewer_institution',
			'sewer_public_toilet',
			'sewer_pipeline',
			'sewer_treatment_plant',
			'manhole'
		]
	},
	// please specify your covered area if you have multipul locations to do waterworks
	areaSwitcher: {
		areas: [
			{ title: 'Narok', latlng: [35.87063, -1.08551], zoom: 14 },
			{ title: "Ololulung'a", latlng: [35.65072, -1.0085], zoom: 13 },
			{ title: 'Kilgoris', latlng: [34.87533, -1.00278], zoom: 14 },
			{ title: 'Suswa', latlng: [36.33078, -1.05307], zoom: 13 }
		]
	},
	// please specify layer name for showing in legend panel.
	legend: {
		targets: {
			pipeline: 'Pipeline',
			pipeline_annotation: 'Pipeline Label',
			meter: 'Water Meter',
			'flow meter': 'Flow Meter',
			valve: 'Valve',
			firehydrant: 'Fire Hydrant',
			washout: 'Washout',
			tank: 'Tank',
			tank_annotation: 'Tank Label',
			wtp: 'WTP',
			wtp_annotation: 'WTP Label',
			intake: 'Intake',
			intake_annotation: 'Intake Label',
			parcels: 'Parcels',
			parcels_annotation: 'Parcels Label',
			village: 'Village',
			village_annotation: 'Village Label',
			dma: 'DMA',
			'dma-annotation': 'DMA Label',
			'contour-line': 'Countour',
			'contour-label': 'Contour Label',
			hillshade: 'Hillshade',
			sewer_connection: 'Households (Sewer)',
			sewer_commercial: 'Commecial (Sewer)',
			sewer_institution: 'Institution (Sewer)',
			sewer_public_toilet: 'Public Toilet (Sewer)',
			manhole: 'Manhole',
			sewer_pipeline: 'Sewer pipeline',
			sewer_treatment_plant: 'Wastewater treatment plant'
		}
	},
	measureOptions: {
		measureUnitType: 'metric',
		distanceUnit: 'kilometer',
		distancePrecision: 2,
		areaPrecision: 2,
		fontGlyphs: ['Roboto Regular'],
		terrainSource: {
			url: 'https://narwassco.github.io/narok-terrain/tiles/{z}/{x}/{y}.png',
			encoding: 'mapbox',
			tileSize: 512,
			minzoom: 5,
			maxzoom: 15,
			tms: false
		}
	},
	valhalla: {
		url: 'https://valhalla.water-gis.com',
		routingOptions: {
			costingModel: 'pedestrian',
			distanceUnit: 'kilometers'
		},
		isochroneOptions: {
			timeCostingModel: 'pedestrian',
			distanceCostingModel: 'pedestrian',
			contours: [
				{ time: 3, distance: 1, color: '#ff0000' },
				{ time: 5, distance: 2, color: '#ffff00' },
				{ time: 10, distance: 3, color: '#0000ff' },
				{ time: 15, distance: 4, color: '#ff00ff' }
			]
		},
		fontGlyphs: ['Roboto Medium']
	},
	terrain: {
		source: 'narok-dem',
		exaggeration: 1
	},
	attributeTable: {
		rowsPerPage: 50,
		minZoom: 14
	},
	tour: {
		tourGuideOptions: {
			steps: [
				{
					title: 'Welcome to sveltekit watergis template!',
					content: `This tutorial is going to take you around the main features of the application. <br> Let's begin!`,
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
							</div>
							`,
					target: '.maplibregl-ctrl-menu',
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
					target: '.maplibregl-ctrl-attribute-table',
					order: 3
				},
				{
					title: 'Sharing tool',
					content:
						'This button enables you to copy and share URL of current map with your colleagues.',
					target: '.maplibregl-ctrl-share',
					order: 4
				},
				{
					title: 'Query tool',
					content: `This button enables you to query details information of selected features on the map. If the tool is enabled, you can click the feature on the map to enquiry details information.`,
					target: '.maplibregl-ctrl-identify',
					order: 5
				},

				{
					title: 'Search features',
					content: `You can search features by typing keywords from the searching box.`,
					target: '.maplibregl-ctrl-geocoder',
					order: 6
				},
				{
					title: 'Measure tool',
					content: `This button enables you to distance (line) and area (polygon) measurement on the map. You can also query elevation of the point or each node of the line.`,
					target: '.maplibregl-terradraw-measure-render-button',
					order: 7
				},
				{
					title: 'Routing and isochrone tool',
					content: `<div style="max-height: 300px; overflow-y: auto">
							This button enables you to use Valhalla routing and isochrone analysis tools.
							<br>
							<b>1) Routing tool</b>: click points on the map to calculate the shortest route with your preferred means of transport.
							<br>
							<b>2) Isochrone analysis tool</b>: click a point on the map to estimate contours by certain time or distance with the selected transport option. It can be used for some SDG indicators such as "Water access within 30 minute round trip".
							<br>
							<img src="/assets/tutorial/isochrone-example.png" width="100%"/>
							<br>
							You can change the means of transport and contours from the settings button.
							</div>`,
					target: '.maplibregl-terradraw-valhalla-render-button',
					order: 8
				},
				{
					title: 'Export tool',
					content: `This button enables you to export images with your preferences.<br>The export dialog shows a preview of the page, and you can choose page size, orientation, image format (png, jpeg, webp, pdf, svg and GeoTIFF) and DPI resolution. Click "Adjust area on map" to change the area to be exported.`,
					target: '.maplibregl-export-control',
					order: 9
				},
				{
					title: 'Area switching tool',
					content: `You can switch the map to the selected area instantly.`,
					target: '.maplibregl-area-switcher',
					order: 0
				},
				{
					title: 'Terrain tool',
					content: `If this is enabled, 3D terrain landscape will be shown. In order to use this, you can tilt the map by holding right-click (mouse) or two fingers (smartphone or tablet)`,
					target: '.maplibregl-ctrl-terrain',
					order: 10
				},
				{
					title: 'GNSS positioning tool',
					content: `GNSS positioning your current location is available by clicking this button.`,
					target: '.maplibregl-ctrl-geolocate',
					order: 11
				}
			],
			rememberStep: true
		},
		tourControlOptions: {
			localStorageKey: `watergis-{url}`
		}
	}
};

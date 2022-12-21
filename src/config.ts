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
	elevation: {
		url: 'https://narwassco.github.io/narok-terrain/tiles/{z}/{x}/{y}.png',
		options: {
			tileSize: 512,
			font: ['Roboto Medium'],
			fontSize: 12,
			fontHalo: 1,
			mainColor: '#263238',
			haloColor: '#fff',
			units: 'kilometers'
		}
	},
	valhalla: {
		url: 'https://valhalla.water-gis.com',
		isoChroneOptions: {
			Contours: [
				{
					time: 3,
					distance: 1,
					color: 'ff0000'
				},
				{
					time: 5,
					distance: 2,
					color: 'ffff00'
				},
				{
					time: 10,
					distance: 3,
					color: '0000ff'
				},
				{
					time: 15,
					distance: 4,
					color: 'ff00ff'
				}
			],
			isochrone: {
				font: ['Roboto Medium'],
				fontSize: 14,
				fontHalo: 3,
				fontColor: '#263238',
				fontHaloColor: '#fff'
			}
		},
		routingOptions: {
			font: ['Roboto Medium'],
			fontSize: 14,
			fontHalo: 3,
			fontColor: '#263238',
			fontHaloColor: '#fff',
			iconImage: 'marker',
			iconSize: 1
		}
	},
	terrain: {
		source: 'narok-dem',
		exaggeration: 1
	}
};

import type { LngLatLike, TerrainSpecification } from 'maplibre-gl';
import type { StyleSwitcherOption } from '@watergis/svelte-maplibre-style-switcher';
import type {
	ValhallaIsochroneOptions,
	ValhallaRoutingOptions
} from '@watergis/svelte-maplibre-valhalla';
import type { TourGuideOptions, MaplibreTourControlOptions } from '@watergis/maplibre-gl-tour';

export type Config = {
	title: string;
	url: string;
	logo: string;
	basePath: string;
	attribution: string;
	styles: StyleSwitcherOption[];
	center: LngLatLike;
	zoom: number;
	search?: {
		url: string;
		target: string[];
		format: (p: { [key: string]: string }) => string;
		place_type: string[];
		placeholder: string;
		zoom: number;
		limit: number;
	};
	popup: {
		target: string[];
	};
	areaSwitcher?: {
		areas: {
			title: string;
			latlng: number[];
			zoom: number;
		}[];
	};
	legend?: {
		targets: { [key: string]: string };
	};
	elevation?: {
		url: string;
		options?: {
			tileSize?: number;
			font?: string[];
			fontSize?: number;
			fontHalo?: number;
			mainColor?: string;
			haloColor?: string;
			units?: string;
		};
	};
	valhalla?: {
		url: string;
		isoChroneOptions: ValhallaIsochroneOptions;
		routingOptions: ValhallaRoutingOptions;
	};
	terrain?: TerrainSpecification;
	attributeTable?: {
		rowsPerPage: number;
		minZoom: number;
	};
	tour?: {
		tourGuideOptions: TourGuideOptions;
		tourControlOptions: MaplibreTourControlOptions;
	};
};

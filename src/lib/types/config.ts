import type { LngLatLike, TerrainSpecification } from 'maplibre-gl';
import type { StyleSwitcherOption } from '@watergis/svelte-maplibre-style-switcher';
import type { TourGuideOptions, MaplibreTourControlOptions } from '@watergis/maplibre-gl-tour';
import type {
	areaUnitType,
	distanceUnitType,
	MeasureUnitType,
	TerrainSource,
	ValhallaOptions
} from '@watergis/maplibre-gl-terradraw';

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
	measureOptions?: {
		measureUnitType?: MeasureUnitType;
		distanceUnit?: distanceUnitType;
		distancePrecision?: number;
		areaUnit?: areaUnitType;
		areaPrecision?: number;
		fontGlyphs?: string[];
		terrainSource?: TerrainSource;
	};
	valhalla?: ValhallaOptions & {
		fontGlyphs?: string[];
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

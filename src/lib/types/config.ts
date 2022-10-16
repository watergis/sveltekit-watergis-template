import type { LngLatLike, TerrainSpecification } from 'maplibre-gl';
import type { Contour } from '$lib/valhalla-isochrone';

export type StyleSwitcherOption = {
	title: string;
	uri: string;
};

export type SearchOption = {
	url: string;
	target: string[];
	format: (p: { [key: string]: string }) => string;
	place_type: string[];
	placeholder: string;
	zoom: number;
};

export type Config = {
	title: string;
	url: string;
	logo: string;
	basePath: string;
	attribution: string;
	styles: StyleSwitcherOption[];
	center: LngLatLike;
	zoom: number;
	search?: SearchOption;
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
		options: {
			Contours?: Contour[];
			routing: {
				font: string[];
				fontSize: number;
				fontHalo: number;
				fontColor: string;
				fontHaloColor: string;
				iconImage: string;
				iconSize: number;
			};
		};
	};
	terrain?: TerrainSpecification;
};

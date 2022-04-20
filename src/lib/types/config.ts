import type { LngLatLike } from 'maplibre-gl';
import type { Options as ElevationOptions } from '@watergis/maplibre-gl-elevation';
import type { Contour } from '../valhalla';

export type StyleSwitcherOption = {
	title: string;
	uri: string;
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
	search?: {
		url: string;
		target: string[];
		format: (p: { customer: string; connno: string; serialno: string; village: string }) => string;
		place_type: string[];
		placeholder: string;
		zoom: number;
	};
	popup: {
		target: string[];
	};
	areaSwitcher: {
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
		options: ElevationOptions;
	};
	valhalla?: {
		url: string;
		options: {
			Contours?: Contour[];
		};
	};
};

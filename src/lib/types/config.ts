import type { LngLatLike, TerrainSpecification } from 'maplibre-gl';
import type { StyleSwitcherOption } from '@watergis/svelte-maplibre-style-switcher';
import type { SearchOption } from '@watergis/svelte-maplibre-search';
import type {
	ValhallaIsochroneOptions,
	ValhallaRoutingOptions
} from '@watergis/svelte-maplibre-valhalla';

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
		isoChroneOptions: ValhallaIsochroneOptions;
		routingOptions: ValhallaRoutingOptions;
	};
	terrain?: TerrainSpecification;
};

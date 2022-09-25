import type { MeasureControlData, StyleSwitcherOption } from '$lib/types';
import type ValhallaIsochrone from '$lib/valhalla-isochrone';
import type { MapGeoJSONFeature, Map, LngLat } from 'maplibre-gl';
import { writable } from 'svelte/store';

// map store for maplibre-gl object
export const map = writable<Map>(null);

export const selectedStyle = writable<StyleSwitcherOption>(null);

export const measureControlData = writable<MeasureControlData>(null);

export const valhallaControlData = writable<{ [key: string]: ValhallaIsochrone }>(null);

export const valhallaRoutingData = writable<LngLat[]>(null);

export const selectedAdvancedPanel = writable<
	'Measure' | 'Routing' | 'TimeIsochrone' | 'DistanceIsochrone'
>('Measure');

export const errorMessage = writable<string[]>([]);

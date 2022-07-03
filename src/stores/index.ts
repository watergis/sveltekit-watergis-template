import type { MeasureControlData, StyleSwitcherOption } from '$lib/types';
import type Valhalla from '$lib/valhalla';
import type { MapGeoJSONFeature, Map } from 'maplibre-gl';
import { writable } from 'svelte/store';

// map store for maplibre-gl object
export const map = writable<Map>(null);

export const spriteLoaderObject = writable(null);

export const selectedStyle = writable<StyleSwitcherOption>(null);

export const queriedFeatures = writable<MapGeoJSONFeature[]>(null);

export const measureControlData = writable<MeasureControlData>(null);

export const valhallaControlData = writable<{ [key: string]: Valhalla }>(null);

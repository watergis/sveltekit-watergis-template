import type { StyleSwitcherOption } from '$lib/types';
import type { MapGeoJSONFeature, Map } from 'maplibre-gl';
import { writable } from 'svelte/store';

// map store for maplibre-gl object
export const map = writable<Map>(null);

export const spriteLoaderObject = writable(null);

export const selectedStyle = writable<StyleSwitcherOption>(null);

export const queriedFeatures = writable<MapGeoJSONFeature[]>(null);

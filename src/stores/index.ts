import { writable } from 'svelte/store';

// map store for maplibre-gl object
export const map = writable(null);

export const spriteLoaderObject = writable(null);

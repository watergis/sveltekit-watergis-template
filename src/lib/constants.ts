import { Costing } from '$lib/valhalla-isochrone';

export enum TabNames {
	LAYERS = 'Layers',
	ADVANCED = 'Advanced'
}

export const costingOptions = [
	{
		value: Costing.Walking,
		label: 'Walking',
		icon: 'fa-person-walking'
	},
	{
		value: Costing.Bicycle,
		label: 'Bicycle',
		icon: 'fa-bicycle'
	},
	{
		value: Costing.Car,
		label: 'Car',
		icon: 'fa-car'
	}
];

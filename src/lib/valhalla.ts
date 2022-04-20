import { Map, Marker } from 'maplibre-gl';

export const Costing = {
	Walking: 'pedestrian',
	Bicycle: 'bicycle',
	Car: 'auto'
	// Multimodal: 'multimodal',
} as const;
type Costing = typeof Costing[keyof typeof Costing];

export const ContourType = {
	Time: 'time',
	Distance: 'distance'
} as const;
type ContourType = typeof ContourType[keyof typeof ContourType];

export type Contour = {
	time?: number;
	distance?: number;
	color: string;
};

export default class Valhalla {
	private map: Map;

	private url: string;

	private contourSources: string[] = [];

	private contourLayers: string[] = [];

	private contourMaker: Marker | undefined = undefined;

	private contours: Contour[] = [
		{
			time: 5,
			distance: 1,
			color: 'ff0000'
		},
		{
			time: 10,
			distance: 3,
			color: 'ffff00'
		},
		{
			time: 15,
			distance: 5,
			color: '0000ff'
		}
	];

	/**
	 * Constructor
	 * @param url URL for terrain RGB raster tilesets
	 */
	constructor(map: Map, url: string, contours?: Contour[]) {
		this.map = map;
		this.url = url;
		if (contours) {
			this.contours = contours;
		}
	}

	clearFeatures() {
		if (this.contourLayers && this.contourLayers.length > 0) {
			this.contourLayers.forEach((id) => {
				this.map?.removeLayer(id);
			});
			this.contourLayers = [];
		}
		if (this.contourSources && this.contourSources.length > 0) {
			this.contourSources.forEach((id) => {
				this.map?.removeSource(id);
			});
			this.contourSources = [];
		}
		if (this.contourMaker) {
			this.contourMaker.remove();
			this.contourMaker = undefined;
		}
	}

	getIsochrone(
		lon: number,
		lat: number,
		contourType: string,
		costing?: string,
		contours?: Contour[]
	): Promise<string | undefined> {
		this.clearFeatures();
		let contourList = JSON.parse(JSON.stringify(this.contours));
		if (contours) {
			contourList = contours;
		}
		contourList.forEach((c) => {
			if (contourType === ContourType.Time) {
				delete c.distance;
			} else {
				delete c.time;
			}
		});
		let unit = 'km';
		if (contourType === ContourType.Time) {
			unit = 'min';
		}

		return new Promise<string | undefined>(
			(resolve: (value?: string) => void, reject: (reason?: Error) => void) => {
				// http://localhost:8002/isochrone?json={%22locations%22:[{%22lat%22:-1.946357,%22lon%22:30.059753}],%22costing%22:%22pedestrian%22,%22contours%22:[{%22time%22:15,%22color%22:%22ff0000%22},{%22time%22:30,%22color%22:%22ffff00%22},{%22time%22:60,%22color%22:%220000ff%22}]}
				const jsonOption = {
					locations: [{ lat, lon }],
					costing,
					contours: contourList,
					polygons: true
				};
				const url = `${this.url}/isochrone?json=${JSON.stringify(jsonOption)}`;
				fetch(url)
					.then((res) => res.json())
					.then((geojson) => {
						geojson.features.forEach((f) => {
							const sourceName = `isochrone-${f.properties.contour}`;
							this.map?.addSource(sourceName, {
								type: 'geojson',
								data: f
							});
							this.contourSources.push(sourceName);
							this.map?.addLayer({
								id: `pg-${sourceName}`,
								type: 'fill',
								source: sourceName,
								layout: {},
								paint: {
									'fill-color': f.properties.fillColor,
									'fill-opacity': 0.1
								}
							});
							this.contourLayers.push(`pg-${sourceName}`);

							this.map?.addLayer({
								id: `ls-${sourceName}`,
								type: 'line',
								source: sourceName,
								layout: {
									'line-join': 'round',
									'line-cap': 'round'
								},
								paint: {
									'line-color': f.properties.fillColor,
									'line-width': 3
								}
							});
							this.contourLayers.push(`ls-${sourceName}`);

							this.map?.addLayer({
								id: `symbol-${sourceName}`,
								type: 'symbol',
								source: sourceName,
								layout: {
									'symbol-placement': 'line',
									'text-pitch-alignment': 'viewport',
									'text-font': ['Roboto Bold'],
									'text-field': ['concat', ['get', 'contour'], ` ${unit}`],
									'text-size': 16
								},
								paint: {
									'text-color': '#000000',
									'text-halo-width': 1,
									'text-halo-color': '#FFFFFF'
								}
							});
							this.contourLayers.push(`symbol-${sourceName}`);
						});
						if (this.map) {
							this.contourMaker = new Marker().setLngLat([lon, lat]).addTo(this.map);
						}
						resolve();
					})
					.catch((err) => reject(err));
			}
		);
	}

	public getContoursOption() {
		return this.contours;
	}
}

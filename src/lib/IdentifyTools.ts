import type { MapGeoJSONFeature, IControl, Map } from 'maplibre-gl';

export default class MaplibreIdentifyTools implements IControl {
	private controlContainer: HTMLElement | undefined;
	private button: HTMLButtonElement | undefined;
	private map?: Map;
	private isActive: boolean;

	constructor(
		private targets: string[] = [],
		private callback?: (features: MapGeoJSONFeature[]) => void
	) {
		this.isActive = false;
	}

	onAdd(map: Map): HTMLElement {
		this.map = map;

		//Below button is just dummy for the control.
		this.controlContainer = document.createElement('div');
		this.controlContainer.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
		this.button = document.createElement('button');
		this.button.className = 'maplibre-identify-icon';
		this.button.type = 'button';
		this.button.addEventListener('click', () => {
			this.changeButtonCondition();
		});
		this.controlContainer.appendChild(this.button);
		this.button.dispatchEvent(new Event('click'));
		return this.controlContainer;
	}

	changeButtonCondition() {
		if (this.isActive) {
			this.button.classList.remove('-active');
			this.isActive = false;
			this.map.off('click', this.onClick.bind(this));
			if (this.callback) {
				this.callback(undefined);
			}
		} else {
			this.button.classList.add('-active');
			this.isActive = true;
			this.map.on('click', this.onClick.bind(this));
		}
	}

	onClick(e) {
		if (!this.isActive) {
			if (this.callback) {
				this.callback([]);
			}
			return;
		}
		const layers = [];
		this.targets.forEach((layer) => {
			if (this.map.getLayer(layer)) {
				layers.push(layer);
			}
		});
		const features = this.map.queryRenderedFeatures(e.point, { layers });
		for (let i = 0; i < features.length; i++) {
			features[i]['open'] = i === 0 ? true : false;
		}
		if (this.callback) {
			this.callback(features);
		}
		return;
	}

	onRemove(): void {
		if (!this.controlContainer || !this.controlContainer.parentNode || !this.map || !this.button) {
			return;
		}
		this.controlContainer.parentNode.removeChild(this.controlContainer);
		this.map.off('click', this.onClick.bind(this));
		this.map = undefined;
	}
}

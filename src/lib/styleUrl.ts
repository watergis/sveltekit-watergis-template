import QueryString from 'update-query-string';

class StyleUrl {
	private STYLE_PATHNAME = 'style';

	public get(): string | null {
		const style = QueryString.get(this.STYLE_PATHNAME);
		return style;
	}

	public set(style: string) {
		QueryString.set(this.STYLE_PATHNAME, style);
	}

	public delete() {
		QueryString.delete(this.STYLE_PATHNAME);
	}

	public matchUrl(styles) {
		let defaultStyleFromUrl = this.get();
		let matched = false;
		for (const style of styles) {
			if (style.title === defaultStyleFromUrl) {
				matched = true;
			}
		}
		if (!matched) {
			this.delete();
			defaultStyleFromUrl = styles[0].title;
			this.set(styles[0].title);
		}
	}

	public getStyleUrl(styles) {
		const defaultTitle = this.get();
		let url = styles[0].uri;
		for (const style of styles) {
			if (style.title === defaultTitle) {
				url = style.uri;
			}
		}
		return url;
	}
}

export default StyleUrl;

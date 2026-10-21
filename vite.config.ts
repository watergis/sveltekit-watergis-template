import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import preprocess from 'svelte-preprocess';
import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		// keep CSS light-dark() as is (used by the maplibre-gl-export dialog);
		// lowering it for older browsers makes the dialog colors invalid
		cssTarget: ['chrome123', 'edge123', 'firefox120', 'safari17.5']
	},
	plugins: [
		sveltekit({
			// Consult https://github.com/sveltejs/svelte-preprocess
			// for more information about preprocessors
			preprocess: preprocess(),
			adapter: adapter({
				// default options are shown
				pages: 'build',
				assets: 'build',
				fallback: null
			}),
			paths: {
				// YOUR github repository name
				// base: process.env.NODE_ENV === 'production' ? '/sveltekit-watergis-template' : ''
				base: ''
			},
			onwarn: () => {
				const SKIP_DEPLOY_TO_GHPAGES = process.env.SKIP_DEPLOY_TO_GHPAGES;
				if (SKIP_DEPLOY_TO_GHPAGES) {
					return;
				}
			}
		})
	]
});

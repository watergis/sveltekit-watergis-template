import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter({
			// default options are shown
			pages: 'build',
			assets: 'build',
			fallback: null
		}),
		paths: {
			// YOUR github repository name
			base: '/sveltekit-maplibre-boilerplate'
		},
		prerender: {
			default: true
		}
	},
	vite: {
		optimizeDeps: {
			esbuildOptions: {
				// Node.js global to browser globalThis
				define: {
					global: 'globalThis'
				},
				// Enable esbuild polyfill plugins
				plugins: []
			}
		},
		build: {
			rollupOptions: {
				plugins: []
			}
		}
	},

	onwarn(warning, defaultHandler) {
		const warningCodeToIgnore = ['a11y-missing-content', 'a11y-missing-attribute'];
		if (warningCodeToIgnore.includes(warning.code)) return;

		defaultHandler(warning);
	}
};

export default config;

import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';
import path from 'path';
import legacy from '@vitejs/plugin-legacy';

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
			base: process.env.NODE_ENV === 'production' ? '/sveltekit-watergis-template' : ''
		},
		prerender: {
			default: true
		}
	},
	vite: {
		ssr: {
			noExternal: [/^@material(?:-extra)?\//]
		},
		alias: {
			$lib: path.resolve('src/lib'),
			$components: path.resolve('./src/components')
		},
		plugins: [
			legacy({
				targets: ['defaults', 'not IE 11'],
				polyfills: true,
				modernPolyfills: true
			})
		]
	}
};

export default config;

import { sveltekit } from '@sveltejs/kit/vite';
import { resolve } from 'path';
import type { UserConfig } from 'vite';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

const config: UserConfig = {
	plugins: [sveltekit()],
	resolve: {
		alias: {
			$config: resolve('./src/config.ts')
		}
	},
	optimizeDeps: {
		esbuildOptions: {
			// Node.js global to browser globalThis
			define: {
				global: 'globalThis'
			},
			// Enable esbuild polyfill plugins
			plugins: [
				NodeGlobalsPolyfillPlugin({
					buffer: true
				})
			]
		}
	}
};

export default config;

import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	alias: {
		$lib: path.resolve('src/lib')
	}
};

export default config;

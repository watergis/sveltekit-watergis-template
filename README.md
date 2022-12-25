# svelte-maplibre-boilerplate

[![build](https://github.com/watergis/sveltekit-watergis-template/actions/workflows/build.yml/badge.svg)](https://github.com/watergis/sveltekit-watergis-template/actions/workflows/build.yml)

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

![demo.gif](./demo.gif)

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm init svelte

# create a new project in my-app
npm init svelte my-app
```

## Environmental variables

```bash
cp .env.example
vi .env
```

Add your own API key `VITE_MAPTILER_KEY` for maptiler. The key can be created at maptiler website [here](https://cloud.maptiler.com/account/keys/). You probably need to sign up first.

Furthermore, edit [config.ts](./src/config.ts) for your environment.

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
pnpm dev

# or start the server and open the app in a new browser tab
pnpm dev -- --open
```

open [http://localhost:3000](http://localhost:3000).

The path of URL can be changed at [svelte.config.js](./svelte.config.js).

## Building

To create a production version of your app:

```bash
pnpm build
```

You can preview the production build with `pnpm preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

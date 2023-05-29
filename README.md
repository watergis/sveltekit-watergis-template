# svelte-maplibre-boilerplate

[![build](https://github.com/watergis/sveltekit-watergis-template/actions/workflows/build.yml/badge.svg)](https://github.com/watergis/sveltekit-watergis-template/actions/workflows/build.yml)
[![Netlify Status](https://api.netlify.com/api/v1/badges/d92c4eb3-79a0-4e2e-aba4-f5fbc14bb469/deploy-status)](https://app.netlify.com/sites/demo-watergis/deploys)

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

## Lefthook

When you clone the repository from Github for the first time, please install `lefthook` in your local machine manually by following commands. So, `lint`, `format` and `build` command will be automatically executed when you commit or push.

```bash
pnpm lefthook install
```

## Building

To create a production version of your app:

```bash
pnpm build
```

You can preview the production build with `pnpm preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

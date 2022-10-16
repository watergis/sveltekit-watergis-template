<script lang="ts">
	import { onMount } from 'svelte';
	import type { TopAppBarComponentDev } from '@smui/top-app-bar';
	import TopAppBar, { Row, Section, Title, AutoAdjust } from '@smui/top-app-bar';
	import { config } from '../../config';
	import MapExport from './MapExport.svelte';
	import ShareURL from './ShareURL.svelte';

	export let drawerOpen = false;

	let darkTheme: boolean;
	let topAppBar: TopAppBarComponentDev;

	onMount(async () => {
		darkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
	});
	const toggleMode = () => {
		drawerOpen = false;
		darkTheme = !darkTheme;
	};
</script>

<svelte:head>
	{#if darkTheme === undefined}
		<link
			rel="stylesheet"
			href="{config.basePath}/smui.css"
			media="(prefers-color-scheme: light)"
		/>
		<link
			rel="stylesheet"
			href="{config.basePath}/smui-dark.css"
			media="screen and (prefers-color-scheme: dark)"
		/>
	{:else if darkTheme}
		<link rel="stylesheet" href="{config.basePath}/smui.css" media="print" />
		<link rel="stylesheet" href="{config.basePath}/smui-dark.css" media="screen" />
	{:else}
		<link rel="stylesheet" href="{config.basePath}/smui.css" />
	{/if}
</svelte:head>

<TopAppBar bind:this={topAppBar} variant="fixed">
	<Row>
		<Section>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div class="icon is-large is-left menu-button" on:click={() => (drawerOpen = !drawerOpen)}>
				<i class="fas {`${drawerOpen ? 'fa-xmark' : 'fa-bars'}`} fa-xl" />
			</div>
			<a href={config.url}>
				<img src={config.logo} alt="logo" class="logo" />
			</a>
			<Title>{config.title}</Title>
		</Section>
		<section />
		<Section align="end" toolbar>
			<ShareURL />
			<MapExport />
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div class="icon is-large is-left menu-button" on:click={toggleMode}>
				<i class="fas {`${darkTheme ? 'fa-sun' : 'fa-moon'}`} fa-xl" />
			</div>
		</Section>
	</Row>
</TopAppBar>
<AutoAdjust {topAppBar} />

<style>
	.logo {
		padding-top: 5px;
		width: 48px;
		height: 48px;
	}

	.menu-button {
		cursor: pointer;
	}
</style>

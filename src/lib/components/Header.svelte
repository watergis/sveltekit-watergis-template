<script lang="ts">
	import { onMount } from 'svelte';
	import type { TopAppBarComponentDev } from '@smui/top-app-bar';
	import TopAppBar, { Row, Section, Title, AutoAdjust } from '@smui/top-app-bar';
	import { config } from '$config';
	import MapExport from './MapExport.svelte';
	import ShareURL from './ShareURL.svelte';
	import LightDarkSwitch from './LightDarkSwitch.svelte';
	import MenuButton from './MenuButton.svelte';

	export let drawerOpen = false;

	let topAppBar: TopAppBarComponentDev;

	let innerWidth = 0;
	let isMobile = innerWidth < 768 ? true : false;

	$: innerWidth, setIsMobile();

	const setIsMobile = () => {
		isMobile = window.matchMedia('only screen and (max-width: 768px)').matches;
	};

	onMount(() => {
		setIsMobile();
	});

	const toggleMode = () => {
		drawerOpen = false;
	};
</script>

<svelte:window bind:innerWidth />

<TopAppBar bind:this={topAppBar} variant="fixed">
	<Row>
		<Section>
			<MenuButton bind:isOpened={drawerOpen} />
			<a href={config.url}>
				<img src={config.logo} alt="logo" class="logo" />
			</a>
			{#if !isMobile}
				<Title>{config.title}</Title>
			{/if}
		</Section>
		<section />
		<Section align="end" toolbar>
			<ShareURL />
			<MapExport />
			<LightDarkSwitch on:change={toggleMode} />
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
</style>

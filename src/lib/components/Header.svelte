<script lang="ts">
	import { onMount } from 'svelte';
	import type { TopAppBarComponentDev } from '@smui/top-app-bar';
	import TopAppBar, { Row, Section, Title, AutoAdjust } from '@smui/top-app-bar';
	import { config } from '$config';
	import MenuButton from './MenuButton.svelte';

	export let drawerOpen = false;

	let darkTheme: boolean;
	let topAppBar: TopAppBarComponentDev;

	let innerWidth = 0;
	let isMobile = innerWidth < 768 ? true : false;

	$: innerWidth, setIsMobile();

	const setIsMobile = () => {
		isMobile = window.matchMedia('only screen and (max-width: 768px)').matches;
		darkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
	};

	onMount(() => {
		setIsMobile();
	});
</script>

<svelte:window bind:innerWidth />

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
			<MenuButton bind:isOpened={drawerOpen} />
			<a href={config.url}>
				<img src={config.logo} alt="logo" class="logo" />
			</a>
			{#if !isMobile}
				<Title>{config.title}</Title>
			{/if}
		</Section>
		<section />
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

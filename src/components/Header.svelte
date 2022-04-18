<script lang="ts">
	import { onMount } from 'svelte';
	import type { TopAppBarComponentDev } from '@smui/top-app-bar';
	import TopAppBar, { Row, Section, Title, AutoAdjust } from '@smui/top-app-bar';
	import IconButton from '@smui/icon-button';
	import { config } from '../config';

	let darkTheme: boolean;
	let topAppBar: TopAppBarComponentDev;

	$: modeLabel = `switch to ${darkTheme ? 'light' : 'dark'} mode`;

	// This icon represents the mode to which the user can switch.
	$: modeIcon = darkTheme ? 'light_mode' : 'dark_mode';

	onMount(() => {
		darkTheme = window.matchMedia('(prefers-color-scheme: light)').matches;
	});
	const toggleMode = () => (darkTheme = !darkTheme);
</script>

<svelte:head>
	{#if darkTheme === undefined}
		<link rel="stylesheet" href="/smui.css" media="(prefers-color-scheme: light)" />
		<link rel="stylesheet" href="/smui-dark.css" media="screen and (prefers-color-scheme: dark)" />
	{:else if darkTheme}
		<link rel="stylesheet" href="/smui.css" media="print" />
		<link rel="stylesheet" href="/smui-dark.css" media="screen" />
	{:else}
		<link rel="stylesheet" href="/smui.css" />
	{/if}
</svelte:head>

<TopAppBar bind:this={topAppBar} variant="fixed">
	<Row>
		<Section>
			<IconButton class="material-icons">menu</IconButton>
			<a href={config.url}>
				<img src={config.logo} alt="logo" class="logo" />
			</a>
			<Title>{config.title}</Title>
		</Section>
		<section />
		<Section align="end" toolbar>
			<IconButton class="material-icons" aria-label="Print">print</IconButton>
			<IconButton
				aria-label={modeLabel}
				class="material-icons"
				on:click={toggleMode}
				title={modeLabel}
			>
				{modeIcon}
			</IconButton>
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

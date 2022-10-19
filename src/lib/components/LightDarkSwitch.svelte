<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import { config } from '$config';

	let darkTheme: boolean;

	const dispatch = createEventDispatcher();

	onMount(async () => {
		darkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
	});
	const toggleMode = () => {
		darkTheme = !darkTheme;
		dispatch('change', {
			isDarkTheme: darkTheme
		});
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

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- <div class="icon is-large is-left menu-button" on:click={toggleMode}>
	<i class="fas {`${darkTheme ? 'fa-sun' : 'fa-moon'}`} fa-xl" />
</div> -->

<!-- <style>
	.menu-button {
		cursor: pointer;
	}
</style> -->

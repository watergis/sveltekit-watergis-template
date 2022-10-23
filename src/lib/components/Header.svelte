<script lang="ts">
	import { onMount } from 'svelte';
	import { config } from '$config';

	export let drawerOpen = false;

	let innerWidth = 0;
	let isMobile = innerWidth < 768 ? true : false;

	$: innerWidth, setIsMobile();

	const setIsMobile = () => {
		isMobile = window.matchMedia('only screen and (max-width: 768px)').matches;
	};

	onMount(() => {
		setIsMobile();
	});
</script>

<svelte:window bind:innerWidth />

<!-- svelte-ignore a11y-no-redundant-roles -->
<nav class="navbar is-link" role="navigation" aria-label="main navigation">
	<div class="navbar-brand">
		<a class="navbar-item" href={config.url}>
			<img src={config.logo} height="48" alt="logo" />
		</a>
		<div class="navbar-item">
			<p class="title m-0 {`${!isMobile ? 'is-4' : 'is-6'}`}" style="color:white;">
				{config.title}
			</p>
		</div>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-missing-attribute -->
		<a
			role="button"
			class="navbar-burger {`${drawerOpen ? 'is-active' : ''}`}"
			aria-label="menu"
			aria-expanded="false"
			on:click={() => (drawerOpen = !drawerOpen)}
		>
			<span aria-hidden="true" />
			<span aria-hidden="true" />
			<span aria-hidden="true" />
		</a>
	</div>

	<div class="navbar-menu">
		<div class="navbar-end">
			<div class="navbar-item">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div class="icon is-large is-left menu-button" on:click={() => (drawerOpen = !drawerOpen)}>
					<i class="fas {`${drawerOpen ? 'fa-xmark' : 'fa-bars'}`} fa-xl" />
				</div>
			</div>
		</div>
	</div>
</nav>

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

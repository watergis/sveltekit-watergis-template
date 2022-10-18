<script lang="ts">
	import { onMount } from 'svelte';
	import { Split } from '@geoffcox/svelte-splitter/src';
	import LayerListPanel from './LayerListPanel.svelte';
	import AdvancedPanel from './AdvancedPanel.svelte';
	import { TabNames } from '$lib/constants';
	import { map } from '$lib/stores';

	let innerWidth = 0;
	let innerHeight = 0;
	let isMobile = innerWidth < 768 ? true : false;
	$: innerWidth, changeDrawerMode();
	$: innerHeight, changeDrawerMode();
	const changeDrawerMode = () => {
		isMobile = innerWidth < 768 ? true : false;
	};
	onMount(() => {
		isMobile = window.matchMedia('only screen and (max-width: 768px)').matches;
	});

	export let open = false;
	let tabs = [
		{
			icon: 'fas fa-layer-group',
			label: TabNames.LAYERS
		},
		{
			icon: 'fas fa-chart-simple',
			label: TabNames.ADVANCED
		}
	];
	let activeTab = tabs[0];
	let isLayersTabVisible = false;
	let isAdvancedTabVisible = false;
	let splitControl: Split;
	let splitterSize = '0px';

	$: activeTab, changeActiveTab();
	const changeActiveTab = () => {
		isLayersTabVisible = false;
		isAdvancedTabVisible = false;
		switch (activeTab.label) {
			case TabNames.LAYERS:
				isLayersTabVisible = true;
				break;
			case TabNames.ADVANCED:
				isAdvancedTabVisible = true;
				break;
		}
	};

	$: open, opened();
	const opened = () => {
		setSplitControl();
		updateLayers();
	};
	let updateLayers = () => {
		return;
	};

	const setSplitControl = () => {
		if (!splitControl) return;
		if (open === true) {
			if (isMobile) {
				splitControl.setPercent(100);
				splitterSize = '0px';
			} else {
				const widthPecent = (380 / innerWidth) * 100;
				splitControl.setPercent(widthPecent);
				splitterSize = '10px';
				splitControl;
			}
		} else {
			splitControl.setPercent(0);
			splitterSize = '0px';
		}
		resizeMap();
	};

	const resizeMap = () => {
		if (!$map) return;
		$map.triggerRepaint();
		$map.resize();
	};

	const splitterChanged = () => {
		resizeMap();
		const percent = splitControl.getPercent();
		if (percent === 0) {
			open = false;
		} else {
			open = true;
		}
	};
	setSplitControl();
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<Split
	initialPrimarySize="0%"
	minPrimarySize={open ? '300px' : '0px'}
	minSecondarySize={isMobile ? '0px' : '50%'}
	{splitterSize}
	on:changed={splitterChanged}
	bind:this={splitControl}
>
	<div slot="primary" class="drawer-content">
		<div class="tabs is-centered is-small mb-0">
			<ul>
				{#each tabs as tab}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<li
						class={activeTab.label === tab.label ? 'is-active' : ''}
						on:click={() => (activeTab = tab)}
					>
						<!-- svelte-ignore a11y-missing-attribute -->
						<a>
							<span class="icon ml-2"><i class={tab.icon} aria-hidden="true" /></span>
							<span>{tab.label}</span>
						</a>
					</li>
					<li />{/each}
			</ul>
		</div>
		<LayerListPanel {isLayersTabVisible} />
		<AdvancedPanel {isAdvancedTabVisible} />
	</div>
	<div slot="secondary" class="main-content">
		<slot />
		<div />
	</div>
</Split>

<style lang="scss">
	$height: calc(100vh - 64px);

	@media (max-width: 768px) {
		$height: calc(100vh - 184px);
	}

	.drawer-content {
		overflow: auto;
		display: flex;
		height: $height;
		flex-direction: column;
		flex-basis: 100%;
		flex: 1;
	}

	.main-content {
		overflow: auto;
		padding: 0px;
		height: 100%;
		width: 100%;
		box-sizing: border-box;
	}
</style>

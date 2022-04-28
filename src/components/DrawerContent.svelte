<script lang="ts">
	import { onMount } from 'svelte';
	import Tab, { Icon, Label } from '@smui/tab';
	import TabBar from '@smui/tab-bar';
	import { Split } from '@geoffcox/svelte-splitter';
	import { queriedFeatures } from '../stores';
	import LayerListPanel from './LayerListPanel.svelte';
	import AttributesPanel from './AttributesPanel.svelte';
	import SearchPanel from './SearchPanel.svelte';
	import AdvancedPanel from './AdvancedPanel.svelte';
	import { TabNames } from '../lib/constants';
	import { map } from '../stores';

	let innerWidth = 0;
	let innerHeight = 0;
	let isMobile = innerWidth < 760 ? true : false;
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
			icon: 'layers',
			label: TabNames.LAYERS
		},
		{
			icon: 'search',
			label: TabNames.SEARCH
		},
		{
			icon: 'info',
			label: TabNames.ATTRIBUTES
		},
		{
			icon: 'analytics',
			label: TabNames.ADVANCED
		}
	];
	let activeTab = tabs[0];
	let isLayersTabVisible = false;
	let isAttributesTabVisible = false;
	let isSearchTabVisible = false;
	let isAdvancedTabVisible = false;
	let splitControl: Split;

	$: activeTab, changeActiveTab();
	const changeActiveTab = () => {
		isLayersTabVisible = false;
		isAttributesTabVisible = false;
		isSearchTabVisible = false;
		isAdvancedTabVisible = false;
		switch (activeTab.label) {
			case TabNames.LAYERS:
				isLayersTabVisible = true;
				break;
			case TabNames.ATTRIBUTES:
				isAttributesTabVisible = true;
				break;
			case TabNames.SEARCH:
				isSearchTabVisible = true;
				break;
			case TabNames.ADVANCED:
				isAdvancedTabVisible = true;
				break;
		}
	};

	$: $queriedFeatures, setDefaultTabAsInfo();
	const setDefaultTabAsInfo = () => {
		const infoTab = tabs.find((t) => t.label === TabNames.ATTRIBUTES);
		if (activeTab !== infoTab && $queriedFeatures && $queriedFeatures.length > 0) {
			if (open !== true) {
				open = true;
			}
			activeTab = infoTab;
			changeActiveTab();
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
			} else {
				splitControl.setPercent(25);
			}
		} else {
			splitControl.setPercent(0);
		}
		resizeMap();
	};

	const resizeMap = () => {
		if ($map) return;
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

<Split initialPrimarySize="0%" on:changed={splitterChanged} bind:this={splitControl}>
	<div slot="primary" class="drawer-content">
		<TabBar {tabs} let:tab bind:active={activeTab}>
			<Tab
				{tab}
				minWidth
				stacked={true}
				indicatorSpanOnlyContent={true}
				tabIndicator$transition="fade"
			>
				<Icon class="material-icons">{tab.icon}</Icon>
				<Label>{tab.label}</Label>
			</Tab>
		</TabBar>
		<LayerListPanel {isLayersTabVisible} bind:updateLayers />
		<SearchPanel {isSearchTabVisible} />
		<AttributesPanel {isAttributesTabVisible} />
		<AdvancedPanel {isAdvancedTabVisible} />
	</div>
	<div slot="secondary" class="main-content">
		<slot />
		<div />
	</div></Split
>

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

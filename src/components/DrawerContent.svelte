<script lang="ts">
	import Drawer, { AppContent, Header } from '@smui/drawer';
	import Tab, { Label } from '@smui/tab';
	import TabBar from '@smui/tab-bar';
	import { queriedFeatures } from '../stores';
	import LayerListPanel from './LayerListPanel.svelte';
	import AttributesPanel from './AttributesPanel.svelte';
	import { TabNames } from '../lib/constants';

	export let open = false;
	let tabs = [TabNames.LAYERS, TabNames.ATTRIBUTES];
	let activeTab = TabNames.LAYERS;
	let isLayersTabVisible = false;
	let isAttributesTabVisible = false;

	$: {
		switch (activeTab) {
			case TabNames.LAYERS:
				isLayersTabVisible = true;
				isAttributesTabVisible = false;
				break;
			case TabNames.ATTRIBUTES:
				isLayersTabVisible = false;
				isAttributesTabVisible = true;
				break;
		}
	}

	$: identifiedFeatures = $queriedFeatures;
	$: {
		if (identifiedFeatures && identifiedFeatures.length > 0) {
			open = true;
		}
	}

	$: open, updateLayers();
	let updateLayers = () => {
		return;
	};
</script>

<div class="drawer-container">
	<Drawer variant="dismissible" bind:open>
		<div class="drawer-content">
			<Header>
				<TabBar {tabs} let:tab bind:active={activeTab}>
					<Tab {tab} minWidth>
						<Label>{tab}</Label>
					</Tab>
				</TabBar>
			</Header>

			<LayerListPanel {isLayersTabVisible} bind:updateLayers />
			<AttributesPanel {isAttributesTabVisible} />
		</div>
	</Drawer>
	<AppContent class="app-content">
		<main class="main-content">
			<slot />
		</main>
	</AppContent>
</div>

<style lang="scss">
	$height: calc(100vh - 64px);

	@media (max-width: 768px) {
		$height: calc(100vh - 184px);
	}

	.drawer-container {
		position: relative;
		display: flex;
		height: $height;
		border: 1px solid var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));
		overflow: auto;
		z-index: 0;

		.drawer-content {
			overflow: auto;
			display: flex;
			height: $height;
			flex-direction: column;
			flex-basis: 100%;
			flex: 1;
		}
	}

	:global(.app-content) {
		flex: auto;
		overflow: auto;
		position: relative;
		flex-grow: 1;
	}

	.main-content {
		overflow: auto;
		padding: 0px;
		height: 100%;
		width: 100%;
		box-sizing: border-box;
	}
</style>

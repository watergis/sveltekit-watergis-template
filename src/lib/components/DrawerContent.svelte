<script lang="ts">
	import LayerListPanel from './LayerListPanel.svelte';
	import AdvancedPanel from './AdvancedPanel.svelte';
	import { TabNames } from '$lib/constants';
	import { config } from '$config';

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
</script>

<div class="drawer-content">
	<a class="icon is-medium logo" href={config.url}>
		<img src={config.logo} alt="logo" />
	</a>
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

<style lang="scss">
	.logo {
		position: absolute;
		top: 0px;
		left: 0px;
		margin: 3px;
	}
</style>

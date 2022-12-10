<script lang="ts">
	import Fa from 'svelte-fa';
	import { faLayerGroup, faChartSimple } from '@fortawesome/free-solid-svg-icons';
	import LayerListPanel from './LayerListPanel.svelte';
	import AdvancedPanel from './AdvancedPanel.svelte';
	import { config } from '$config';

	enum TabNames {
		LAYERS = 'Layers',
		ADVANCED = 'Advanced'
	}

	let tabs = [
		{
			icon: faLayerGroup,
			label: TabNames.LAYERS
		},
		{
			icon: faChartSimple,
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
	<div class="header">
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
							<span class="icon ml-2"><Fa icon={tab.icon} size="2x" aria-hidden="true" /></span>
							<span>{tab.label}</span>
						</a>
					</li>
					<li />{/each}
			</ul>
		</div>
	</div>
	<div hidden={activeTab.label !== TabNames.LAYERS}>
		<LayerListPanel />
	</div>
	<div hidden={activeTab.label !== TabNames.ADVANCED}>
		<AdvancedPanel />
	</div>
</div>

<style lang="scss">
	@import 'bulma/bulma.sass';

	.drawer-content {
		display: flex;
		flex-direction: column;

		.header {
			display: flex;
			flex-direction: row;

			.logo {
				margin: 3px;
			}

			.tabs {
				margin-left: 0.5rem;
				width: 100%;
			}
		}
	}
</style>

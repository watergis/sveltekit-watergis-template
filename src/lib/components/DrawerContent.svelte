<script lang="ts">
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { config } from '../../config';
	import AdvancedPanel from './AdvancedPanel.svelte';
	import LayerListPanel from './LayerListPanel.svelte';

	enum TabNames {
		LAYERS = 'Layers',
		ADVANCED = 'Advanced'
	}

	let tabs = [
		{
			icon: 'fa-solid fa-layer-group',
			label: TabNames.LAYERS
		},
		{
			icon: 'fa-solid fa-chart-simple',
			label: TabNames.ADVANCED
		}
	];
	let activeTab = $state(tabs[0]);

	let tabHeight = writable<number>(0);

	setContext('tab-height', tabHeight);
</script>

<div class="drawer-content">
	<div class="header" bind:clientHeight={$tabHeight}>
		<a class="icon is-medium logo" href={config.url}>
			<img src={config.logo} alt="logo" />
		</a>
		<div class="tabs is-centered mb-0">
			<ul>
				{#each tabs as tab (tab.label)}
					<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<li
						class={activeTab.label === tab.label ? 'is-active' : ''}
						onclick={() => (activeTab = tab)}
					>
						<!-- svelte-ignore a11y_missing_attribute -->
						<a>
							<span class="icon is-small"><i class={tab.icon} aria-hidden="true"></i></span>
							<span>{tab.label}</span>
						</a>
					</li>
					<li></li>{/each}
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
	.drawer-content {
		display: flex;
		flex-direction: column;

		.header {
			position: relative;

			.logo {
				position: absolute;
				top: 5px;
				left: 5px;
			}
		}
	}
</style>

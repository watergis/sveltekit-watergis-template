<script lang="ts">
	import { config } from '$config';
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
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
	let activeTab = tabs[0];

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
				{#each tabs as tab}
					<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<li
						class={activeTab.label === tab.label ? 'is-active' : ''}
						on:click={() => (activeTab = tab)}
					>
						<!-- svelte-ignore a11y-missing-attribute -->
						<a>
							<span class="icon is-small"><i class={tab.icon} aria-hidden="true"></i></span>
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

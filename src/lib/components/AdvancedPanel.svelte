<script lang="ts">
	import { onMount } from 'svelte';
	import { ContourType } from '$lib/valhalla-isochrone';

	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
	import MeasurePanel from './MeasurePanel.svelte';

	import ValhallaIsochronePanel from './ValhallaIsochronePanel.svelte';
	import ValhallaRoutingPanel from './ValhallaRoutingPanel.svelte';
	import { selectedAdvancedPanel } from '$lib/stores';

	export let isAdvancedTabVisible = false;

	let panelMeasureOpen = true;
	let panelRoutingOpen = false;
	let panelTimeIsochroneOpen = false;
	let panelDistanceIsochroneOpen = false;

	$: {
		if (panelMeasureOpen === true) {
			$selectedAdvancedPanel = 'Measure';
		} else if (panelRoutingOpen === true) {
			$selectedAdvancedPanel = 'Routing';
		} else if (panelTimeIsochroneOpen === true) {
			$selectedAdvancedPanel = 'TimeIsochrone';
		} else if (panelDistanceIsochroneOpen === true) {
			$selectedAdvancedPanel = 'DistanceIsochrone';
		}
	}

	onMount(() => {
		switch ($selectedAdvancedPanel) {
			case 'Measure':
				panelMeasureOpen = true;
				break;
			case 'Routing':
				panelRoutingOpen = true;
				break;
			case 'TimeIsochrone':
				panelTimeIsochroneOpen = true;
				break;
			case 'DistanceIsochrone':
				panelDistanceIsochroneOpen = true;
				break;
			default:
				break;
		}
	});
</script>

{#if isAdvancedTabVisible}
	<div class="accordion-container">
		<Accordion>
			<Panel bind:open={panelMeasureOpen}>
				<Header>
					<div class="level">
						<p class="level-left">Measuring tool</p>
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<div
							class="icon is-small level-right menu-button"
							on:click={() => (panelMeasureOpen = !panelMeasureOpen)}
						>
							<i class="fas {`${panelMeasureOpen ? 'fa-chevron-down' : 'fa-chevron-up'}`}" />
						</div>
					</div>
				</Header>
				<Content>
					<MeasurePanel />
				</Content>
			</Panel>
			<Panel bind:open={panelRoutingOpen}>
				<Header>
					<div class="level">
						<p class="level-left">Routing tool</p>
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<div
							class="icon is-small level-right menu-button"
							on:click={() => (panelRoutingOpen = !panelRoutingOpen)}
						>
							<i class="fas {`${panelRoutingOpen ? 'fa-chevron-down' : 'fa-chevron-up'}`}" />
						</div>
					</div>
				</Header>
				<Content>
					<ValhallaRoutingPanel />
				</Content>
			</Panel>
			<Panel bind:open={panelTimeIsochroneOpen}>
				<Header>
					<div class="level">
						<p class="level-left">Time Isochrone</p>
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<div
							class="icon is-small level-right menu-button"
							on:click={() => (panelTimeIsochroneOpen = !panelTimeIsochroneOpen)}
						>
							<i class="fas {`${panelTimeIsochroneOpen ? 'fa-chevron-down' : 'fa-chevron-up'}`}" />
						</div>
					</div>
				</Header>
				<Content>
					<ValhallaIsochronePanel bind:contourType={ContourType.Time} />
				</Content>
			</Panel>
			<Panel bind:open={panelDistanceIsochroneOpen}>
				<Header>
					<div class="level">
						<p class="level-left">Distance Isochrone</p>
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<div
							class="icon is-small level-right menu-button"
							on:click={() => (panelDistanceIsochroneOpen = !panelDistanceIsochroneOpen)}
						>
							<i
								class="fas {`${panelDistanceIsochroneOpen ? 'fa-chevron-down' : 'fa-chevron-up'}`}"
							/>
						</div>
					</div>
				</Header>
				<Content>
					<ValhallaIsochronePanel bind:contourType={ContourType.Distance} />
				</Content>
			</Panel>
		</Accordion>
	</div>
{/if}

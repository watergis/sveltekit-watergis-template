<script lang="ts">
	import { onMount } from 'svelte';
	import { ContourType } from '$lib/valhalla-isochrone';

	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
	import IconButton, { Icon } from '@smui/icon-button';
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
					Measuring tool
					<IconButton slot="icon" toggle pressed={panelMeasureOpen}>
						<Icon class="material-icons" on>expand_less</Icon>
						<Icon class="material-icons">expand_more</Icon>
					</IconButton>
				</Header>
				<Content>
					<MeasurePanel />
				</Content>
			</Panel>
			<Panel bind:open={panelRoutingOpen}>
				<Header>
					Routing tool
					<IconButton slot="icon" toggle pressed={panelRoutingOpen}>
						<Icon class="material-icons" on>expand_less</Icon>
						<Icon class="material-icons">expand_more</Icon>
					</IconButton>
				</Header>
				<Content>
					<ValhallaRoutingPanel />
				</Content>
			</Panel>
			<Panel bind:open={panelTimeIsochroneOpen}>
				<Header>
					Time Isochrone
					<IconButton slot="icon" toggle pressed={panelTimeIsochroneOpen}>
						<Icon class="material-icons" on>expand_less</Icon>
						<Icon class="material-icons">expand_more</Icon>
					</IconButton>
				</Header>
				<Content>
					<ValhallaIsochronePanel bind:contourType={ContourType.Time} />
				</Content>
			</Panel>
			<Panel bind:open={panelDistanceIsochroneOpen}>
				<Header>
					Distance Isochrone
					<IconButton slot="icon" toggle pressed={panelDistanceIsochroneOpen}>
						<Icon class="material-icons" on>expand_less</Icon>
						<Icon class="material-icons">expand_more</Icon>
					</IconButton>
				</Header>
				<Content>
					<ValhallaIsochronePanel bind:contourType={ContourType.Distance} />
				</Content>
			</Panel>
		</Accordion>
	</div>
{/if}

<script lang="ts">
	import { ContourType } from '$lib/valhalla';

	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
	import IconButton, { Icon } from '@smui/icon-button';
	import MeasurePanel from './MeasurePanel.svelte';

	import ValhallaPanel from './ValhallaPanel.svelte';

	export let isAdvancedTabVisible = false;

	let panel1Open = true;
	let panel2Open = false;
	let panel3Open = false;
</script>

{#if isAdvancedTabVisible}
	<div class="accordion-container">
		<Accordion>
			<Panel open={true}>
				<Header>
					Measuring tool
					<IconButton slot="icon" toggle pressed={panel1Open}>
						<Icon class="material-icons" on>expand_less</Icon>
						<Icon class="material-icons">expand_more</Icon>
					</IconButton>
				</Header>
				<Content>
					<MeasurePanel />
				</Content>
			</Panel>
			<Panel>
				<Header>
					Time Isochrone
					<IconButton slot="icon" toggle pressed={panel2Open}>
						<Icon class="material-icons" on>expand_less</Icon>
						<Icon class="material-icons">expand_more</Icon>
					</IconButton>
				</Header>
				<Content>
					<ValhallaPanel bind:contourType={ContourType.Time} />
				</Content>
			</Panel>
			<Panel>
				<Header>
					Distance Isochrone
					<IconButton slot="icon" toggle pressed={panel3Open}>
						<Icon class="material-icons" on>expand_less</Icon>
						<Icon class="material-icons">expand_more</Icon>
					</IconButton>
				</Header>
				<Content>
					<ValhallaPanel bind:contourType={ContourType.Distance} />
				</Content>
			</Panel>
		</Accordion>
	</div>
{/if}

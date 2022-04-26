<script lang="ts">
	import { ContourType } from '$lib/valhalla';

	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
	import MeasurePanel from './MeasurePanel.svelte';

	import ValhallaPanel from './ValhallaPanel.svelte';

	export let isAdvancedTabVisible = false;
</script>

{#if isAdvancedTabVisible}
	<div class="accordion-container">
		<Accordion>
			<Panel open={true}>
				<Header>Measuring tool</Header>
				<Content>
					<MeasurePanel />
				</Content>
			</Panel>
			<Panel>
				<Header>Time Isochrone</Header>
				<Content>
					<ValhallaPanel bind:contourType={ContourType.Time} />
				</Content>
			</Panel>
			<Panel>
				<Header>Distance Isochrone</Header>
				<Content>
					<ValhallaPanel bind:contourType={ContourType.Distance} />
				</Content>
			</Panel>
		</Accordion>
	</div>
{/if}

<script lang="ts">
	import { ContourType } from '$lib/valhalla';

	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';

	import ValhallaPanel from './ValhallaPanel.svelte';

	export let isAdvancedTabVisible = false;
</script>

{#if isAdvancedTabVisible}
	<div class="accordion-container">
		<Accordion>
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

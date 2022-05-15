<script lang="ts">
	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
	import IconButton, { Icon } from '@smui/icon-button';
	import SearchControl from './SearchControl.svelte';
	import ZoomToAreaControl from './ZoomToAreaControl.svelte';
	export let isSearchTabVisible = false;

	export let parentPanelOpen = false;
	let panelZoomOpen = true;
	let panelSearchOpen = true;

	const zoomed = () => {
		parentPanelOpen = false;
	};
</script>

{#if isSearchTabVisible}
	<div class="accordion-container">
		<Accordion multiple>
			<Panel bind:open={panelZoomOpen}>
				<Header>
					Zoom to area
					<IconButton slot="icon" toggle pressed={panelZoomOpen}>
						<Icon class="material-icons" on>expand_less</Icon>
						<Icon class="material-icons">expand_more</Icon>
					</IconButton>
				</Header>
				<Content>
					<ZoomToAreaControl on:zoomed={zoomed} />
				</Content>
			</Panel>
			<Panel bind:open={panelSearchOpen}>
				<Header>
					Search
					<IconButton slot="icon" toggle pressed={panelSearchOpen}>
						<Icon class="material-icons" on>expand_less</Icon>
						<Icon class="material-icons">expand_more</Icon>
					</IconButton>
				</Header>
				<Content>
					<SearchControl on:zoomed={zoomed} />
				</Content>
			</Panel>
		</Accordion>
	</div>
{/if}

<style lang="scss">
</style>

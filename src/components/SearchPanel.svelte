<script lang="ts">
	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
	import IconButton, { Icon } from '@smui/icon-button';
	import SearchControl from './SearchControl.svelte';
	import ZoomToAreaControl from './ZoomToAreaControl.svelte';
	export let isSearchTabVisible = false;

	let panel1Open = true;
	let panel2Open = true;
</script>

{#if isSearchTabVisible}
	<div class="accordion-container">
		<Accordion multiple>
			<Panel bind:open={panel1Open}>
				<Header>
					Zoom to area
					<IconButton slot="icon" toggle pressed={panel1Open}>
						<Icon class="material-icons" on>expand_less</Icon>
						<Icon class="material-icons">expand_more</Icon>
					</IconButton>
				</Header>
				<Content>
					<ZoomToAreaControl />
				</Content>
			</Panel>
			<Panel bind:open={panel2Open}>
				<Header>
					Search
					<IconButton slot="icon" toggle pressed={panel2Open}>
						<Icon class="material-icons" on>expand_less</Icon>
						<Icon class="material-icons">expand_more</Icon>
					</IconButton>
				</Header>
				<Content>
					<SearchControl />
				</Content>
			</Panel>
		</Accordion>
	</div>
{/if}

<style lang="scss">
</style>

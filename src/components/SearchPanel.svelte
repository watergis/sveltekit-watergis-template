<script lang="ts">
	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
	import SearchControl from './SearchControl.svelte';
	import ZoomToAreaControl from './ZoomToAreaControl.svelte';
	export let isSearchTabVisible = false;
</script>

{#if isSearchTabVisible}
	<div class="accordion-container">
		<Accordion multiple>
			<Panel open>
				<Header>Zoom to area</Header>
				<Content>
					<ZoomToAreaControl />
				</Content>
			</Panel>
			<Panel open>
				<Header>Search</Header>
				<Content>
					<SearchControl />
				</Content>
			</Panel>
		</Accordion>
	</div>
{/if}

<style lang="scss">
</style>

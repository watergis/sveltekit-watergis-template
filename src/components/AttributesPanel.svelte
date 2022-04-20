<script lang="ts">
	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
	import DataTable, { Body, Row, Cell } from '@smui/data-table';
	import Fa from 'svelte-fa';
	import { faCircleInfo } from '@fortawesome/free-solid-svg-icons/faCircleInfo';
	import { queriedFeatures } from '../stores';

	export let isAttributesTabVisible = false;

	$: identifiedFeatures = $queriedFeatures;
</script>

{#if isAttributesTabVisible}
	<div class="accordion-container">
		{#if identifiedFeatures?.length > 0}
			<Accordion>
				{#each identifiedFeatures as feature}
					<Panel>
						<Header>
							{feature.layer.id}
							<span slot="description">{feature.source}</span>
						</Header>
						<Content>
							<DataTable table$aria-label={feature.layer.id} style="width: 100%;">
								<Body>
									{#each Object.keys(feature.properties) as key}
										<Row>
											<Cell>{key}</Cell>
											<Cell>{feature.properties[key]}</Cell>
										</Row>
									{/each}
								</Body>
							</DataTable>
						</Content>
					</Panel>
				{/each}
			</Accordion>
		{:else}
			<ul class="no-data-layers">
				<li class="message">
					<div class="icon">
						<Fa icon={faCircleInfo} size="lg" primaryColor="dodgerblue" />
					</div>
					<div class="text">No features identified on the map.</div>
				</li>
			</ul>
		{/if}
	</div>
{/if}

<style lang="scss">
	ul {
		margin: 0;
		list-style: none;
		padding-left: 1.2rem;
		user-select: none;
		padding-top: 5px;

		li {
			display: flex;
			justify-content: left;
			align-items: center;
			padding: 10px;

			@media (prefers-color-scheme: dark) {
				background: #323234;
				border-color: #30363d;
				color: white;
			}

			.text {
				padding-left: 15px;
			}
		}
	}
</style>

<script lang="ts">
	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
	import IconButton, { Icon } from '@smui/icon-button';
	import Fa from 'svelte-fa';
	import { faCircleInfo } from '@fortawesome/free-solid-svg-icons/faCircleInfo';
	import { queriedFeatures } from '$lib/stores';

	export let isAttributesTabVisible = false;

	$: identifiedFeatures = $queriedFeatures;
</script>

{#if isAttributesTabVisible}
	<div class="accordion-container">
		{#if identifiedFeatures?.length > 0}
			<Accordion>
				{#each identifiedFeatures as feature}
					<Panel bind:open={feature['open']}>
						<Header>
							{feature.layer.id}
							<span slot="description">{feature.source}</span>
							<IconButton slot="icon" toggle pressed={feature['open']}>
								<Icon class="material-icons" on>expand_less</Icon>
								<Icon class="material-icons">expand_more</Icon>
							</IconButton>
						</Header>
						<Content>
							<table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
								<tbody>
									{#each Object.keys(feature.properties) as key}
										<tr>
											<th>{key}</th>
											<td>{feature.properties[key]}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</Content>
					</Panel>
				{/each}
			</Accordion>
		{:else}
			<div class="card">
				<div class="card-content">
					<div class="content">
						<div class="columns is-mobile">
							<div class="column is-1">
								<Fa icon={faCircleInfo} size="lg" primaryColor="dodgerblue" />
							</div>
							<div class="column">
								<p>No features identified on the map.</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
{/if}

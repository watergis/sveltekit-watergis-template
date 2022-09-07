<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import IconButton from '@smui/icon-button';
	import Dialog, { Title, Content, Actions } from '@smui/dialog';
	import Button, { Label, Icon } from '@smui/button';
	import { copy } from 'svelte-copy';
	import { map, selectedStyle } from '../stores';

	let isDialogOpen;

	$: url = setPageUrl();

	let textCopyButton = 'Copy';

	const handleCopy = () => {
		textCopyButton = 'copied';
		setTimeout(() => {
			textCopyButton = 'Copy';
		}, 2000);
	};

	$: if (isDialogOpen === true) {
		setPageUrl();
	}

	const setPageUrl = () => {
		if (!$map) return;
		const baseUrl = `${$page.url.protocol}//${$page.url.host}`;
		const zoom = `#${$map.getZoom().toFixed(2)}`;
		const lat = `/${$map.getCenter().lat.toFixed(6)}`;
		const lng = `/${$map.getCenter().lng.toFixed(6)}`;
		const bearing = $map.getBearing() !== 0 ? `/${$map.getBearing().toFixed(1)}` : '';
		const pitch = $map.getPitch() !== 0 ? `/${$map.getPitch().toFixed()}` : '';
		const style = `/?style=${$selectedStyle.title}`;
		url = `${baseUrl}${style}${zoom}${lat}${lng}${bearing}${pitch}`;
		return url;
	};
</script>

<IconButton class="material-icons" aria-label="Share" on:click={() => (isDialogOpen = true)}
	>share</IconButton
>

<Dialog
	bind:open={isDialogOpen}
	aria-labelledby="mandatory-title"
	aria-describedby="mandatory-content"
>
	<Title id="mandatory-title">URL to share</Title>
	<Content id="mandatory-content">
		<div class="copy-control">
			<input
				class="input copy-text"
				type="text"
				placeholder="URL to share"
				bind:value={url}
				readonly
			/>
			<div use:copy={url}>
				<Button style="margin-left: 0.5em;width:100px;" on:click={handleCopy} variant="raised">
					<Icon class="material-icons">content_copy</Icon>
					<Label>{textCopyButton}</Label>
				</Button>
			</div>
		</div>
	</Content>
	<div>
		<Actions>
			<Button
				style="margin-top: 1em;"
				on:click={() => {
					isDialogOpen = false;
				}}
				variant="raised"
			>
				<Icon class="material-icons">cancel</Icon>
				<Label>Cancel</Label>
			</Button>
		</Actions>
	</div>
</Dialog>

<style lang="scss">
	.copy-control {
		display: flex;

		.copy-text {
			width: 200px;
			height: 30px;
		}
	}
</style>

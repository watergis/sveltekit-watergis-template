<script lang="ts">
	import { page } from '$app/stores';
	import IconButton from '@smui/icon-button';
	import { copy } from 'svelte-copy';
	import { map, selectedStyle } from '$lib/stores';
	import Fa from 'svelte-fa';
	import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy';

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

	const handleClose = () => {
		isDialogOpen = false;
	};
</script>

<IconButton class="material-icons" aria-label="Share" on:click={() => (isDialogOpen = true)}
	>share</IconButton
>

<div class="modal {isDialogOpen ? 'is-active' : ''}">
	<div class="modal-background" on:click={handleClose} />
	<div class="modal-card">
		<header class="modal-card-head">
			<p class="modal-card-title">URL to share</p>
			<button class="delete" aria-label="close" on:click={handleClose} />
		</header>
		<section class="modal-card-body">
			<div class="columns is-vcentered">
				<div class="column is-marginless is-paddingless is-9">
					<input
						class="input is-link"
						type="text"
						placeholder="URL to share"
						bind:value={url}
						readonly
					/>
				</div>
				<div class="column is-marginless is-paddingless">
					<button class="button is-link is-light" on:click={handleCopy} use:copy={url}>
						<Fa icon={faCopy} scale={1} />
						<div style="padding-left:5px;">{textCopyButton}</div>
					</button>
				</div>
			</div>
		</section>
		<footer class="modal-card-foot">
			<button class="button" on:click={handleClose}>Cancel</button>
		</footer>
	</div>
</div>

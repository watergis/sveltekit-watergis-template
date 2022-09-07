<script lang="ts">
    import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import IconButton from '@smui/icon-button';
	import Dialog, { Title, Content, Actions } from '@smui/dialog';
	import Button, { Label, Icon } from '@smui/button';
	import { copy } from 'svelte-copy';

	let isDialogOpen;

	$: url = $page.url.toString()

	let textCopyButton = 'Copy';

	const handleCopy = () => {
		textCopyButton = 'copied';
		setTimeout(() => {
			textCopyButton = 'Copy';
		}, 2000);
	};

    $: if (isDialogOpen === true) {
		setPageUrl()
        console.log(url, $page.url.toString())
    }

	const setPageUrl = () =>{
		url = $page.url.toString()
	}
</script>

<IconButton class="material-icons" aria-label="Share" on:click={() => (isDialogOpen = true)}
	>ios_share</IconButton
>

<Dialog
	bind:open={isDialogOpen}
	aria-labelledby="mandatory-title"
	aria-describedby="mandatory-content"
>
	<Title id="mandatory-title">URL to share</Title>
	<Content id="mandatory-content">
		<div class="copy-control">
            <input class="input copy-text" type="text" placeholder="URL to share" bind:value={url} readonly />
			<div use:copy={url}>
				<Button
					style="margin-left: 0.5em;width:100px;"
					on:click={handleCopy}
					variant="raised"
				>
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

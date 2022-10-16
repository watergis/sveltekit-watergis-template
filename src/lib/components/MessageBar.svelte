<script lang="ts">
	import type { SnackbarComponentDev } from '@smui/snackbar';
	import Snackbar, { Actions, Label } from '@smui/snackbar';
	import { errorMessage } from '$lib/stores';

	let snackbar: SnackbarComponentDev;
	let message: string;
	$: {
		if ($errorMessage && $errorMessage.length > 0) {
			if (snackbar) {
				message = $errorMessage.shift();
				snackbar.open();
			}
		}
	}
</script>

<Snackbar bind:this={snackbar}>
	<Label>
		{message}
	</Label>
	<Actions>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="icon is-small menu-button" style="color: white" on:click={() => snackbar.close()}>
			<i class="fas fa-xmark" />
		</div>
	</Actions>
</Snackbar>

<style>
	.menu-button {
		cursor: pointer;
	}
</style>

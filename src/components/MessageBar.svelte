<script lang="ts">
	import type { SnackbarComponentDev } from '@smui/snackbar';
	import Snackbar, { Actions, Label } from '@smui/snackbar';
	import IconButton from '@smui/icon-button';
	import { errorMessage } from '../stores';

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
		<IconButton class="material-icons" title="Dismiss">close</IconButton>
	</Actions>
</Snackbar>

<style lang="scss">
</style>

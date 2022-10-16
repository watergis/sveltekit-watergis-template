<script lang="ts">
	export let isOpened = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="icon is-large is-left menu-button" on:click={() => (isOpened = !isOpened)}>
	<i class="fas {`${isOpened ? 'fa-xmark' : 'fa-bars'}`} fa-xl" />
</div>

<style>
	.menu-button {
		cursor: pointer;
	}
</style>

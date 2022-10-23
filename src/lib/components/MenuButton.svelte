<script lang="ts">
	export let isOpened = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- <div class="icon is-large is-left menu-button" on:click={() => (isOpened = !isOpened)}>
	<i class="fas {`${isOpened ? 'fa-xmark' : 'fa-bars'}`} fa-xl" />
</div> -->

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-missing-attribute -->
<a
	role="button"
	class="navbar-burger {`${isOpened ? 'is-active' : ''}`}"
	aria-label="menu"
	aria-expanded="false"
	on:click={() => (isOpened = !isOpened)}
>
	<span aria-hidden="true" />
	<span aria-hidden="true" />
	<span aria-hidden="true" />
</a>

<style>
	.menu-button {
		cursor: pointer;
	}
</style>

<script lang="ts">
	import SearchControl from './SearchControl.svelte';
	import ZoomToAreaControl from './ZoomToAreaControl.svelte';
	export let isSearchTabVisible = false;
</script>

{#if isSearchTabVisible}
	<ZoomToAreaControl />
	<SearchControl />
{/if}

<style lang="scss">
	.select {
		padding-left: 1.5em;
	}
</style>

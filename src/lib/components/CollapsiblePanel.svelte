<script lang="ts">
	export let title: string;

	export let isPanelOpen = false;
</script>

<div class="card">
	<header class="card-header">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<p class="card-header-title" on:click={() => (isPanelOpen = !isPanelOpen)}>
			{title}
		</p>
		<!-- svelte-ignore a11y-invalid-attribute -->
		<a
			href=""
			data-action="collapse"
			class="card-header-icon is-hidden-fullscreen"
			aria-label="more options"
			on:click={() => (isPanelOpen = !isPanelOpen)}
		>
			<span class="icon">
				{#if isPanelOpen}
					<i class="fas fa-angle-down" aria-hidden="true" />
				{:else}
					<i class="fas fa-angle-up" aria-hidden="true" />
				{/if}
			</span>
		</a>
	</header>
	{#if isPanelOpen}
		<div class="is-collapsible">
			<slot />
		</div>
	{/if}
</div>

<style>
	@import '@creativebulma/bulma-collapsible/dist/css/bulma-collapsible.min.css';

	.card-header-title {
		cursor: pointer;
	}
</style>

<script lang="ts">
	import { onMount } from 'svelte';
	import IconButton from '@smui/icon-button';
	import { PageOrientation, Size, DPI, Format, Unit } from '../lib/MapGenerator';
	import { map } from '../stores';

	let mapGenerator: any;
	onMount(async () => {
		const { default: MapGenerator } = await import('../lib/MapGenerator');
		mapGenerator = new MapGenerator();
	});

	const exportMap = () => {
		mapGenerator.generate($map, Size.A4, DPI[300], Format.PDF, Unit.mm);
	};
</script>

<IconButton
	class="material-icons"
	aria-label="Print"
	on:click={() => {
		exportMap();
	}}>print</IconButton
>

<style>
</style>

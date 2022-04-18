<script lang="ts">
	import Header from '../components/Header.svelte';
	import DrawerContent from '../components/DrawerContent.svelte';
	import Map from '../components/Map.svelte';

	let drawerOpen = false;
</script>

<Header bind:drawerOpen />
<DrawerContent bind:open={drawerOpen}>
	<Map />
</DrawerContent>

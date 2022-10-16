<script lang="ts">
	import { onMount } from 'svelte';
	import { PageOrientation, Size, DPI, Format, Unit } from '$lib/map-generator';
	import type MapGenerator from '$lib/map-generator';
	// import PrintableAreaManager from '$lib/printable-area-manager';
	import { map } from '$lib/stores';

	let mapGenerator: MapGenerator;
	// let printableArea;
	let paperSize = Size.A4;
	let dpi = DPI[96];
	let format = Format.PNG;
	let orientation = PageOrientation.Landscape;
	let isDialogOpen = false;

	// $: paperSize, updatePrintableArea();
	// $: orientation, updatePrintableArea();

	// $: {
	// 	if (!isDialogOpen) {
	// 		togglePrintableArea(false);
	// 	}
	// }

	onMount(async () => {
		const { default: MapGenerator } = await import('../map-generator');
		mapGenerator = new MapGenerator();
	});

	const getActualPaperSize = () => {
		let actualPaperSize = [paperSize[0], paperSize[1]];
		if (orientation !== PageOrientation.Landscape) {
			actualPaperSize = actualPaperSize.reverse();
		}
		return actualPaperSize;
	};

	const exportMap = () => {
		const actualPaperSize = getActualPaperSize();
		mapGenerator.generate(
			$map,
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			actualPaperSize,
			dpi,
			format,
			Unit.mm
		);
		handleClose();
	};
	const openMenu = () => {
		isDialogOpen = true;
		// togglePrintableArea(true);
	};

	// const togglePrintableArea = (state: boolean) => {
	// 	if (state === false) {
	// 		if (printableArea !== undefined) {
	// 			printableArea.destroy();
	// 			printableArea = undefined;
	// 		}
	// 	} else {
	// 		printableArea = new PrintableAreaManager($map);
	// 		updatePrintableArea();
	// 	}
	// };

	// const updatePrintableArea = () => {
	// 	if (printableArea === undefined) {
	// 		return;
	// 	}
	// 	const actualPaperSize = getActualPaperSize();
	// 	printableArea.updateArea(actualPaperSize[0], actualPaperSize[1]);
	// };

	const handleClose = () => {
		// togglePrintableArea(false);
		isDialogOpen = false;
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="icon is-large is-left menu-button" on:click={openMenu}>
	<i class="fas fa-print fa-xl" />
</div>

<div class="modal {`${isDialogOpen ? 'is-active' : ''}`}">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="modal-background" on:click={handleClose} />
	<div class="modal-card">
		<header class="modal-card-head">
			<p class="modal-card-title">Export</p>
			<button class="delete" aria-label="close" on:click={handleClose} />
		</header>
		<section class="modal-card-body">
			<div class="field">
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label class="label">Paper Size</label>
				<div class="control has-icons-left">
					<div class="select is-fullwidth">
						<select bind:value={paperSize}>
							{#each Object.keys(Size) as key}
								<option value={Size[key]}>{key}</option>
							{/each}
						</select>
					</div>
					<div class="icon is-small is-left">
						<i class="fas fa-file" />
					</div>
				</div>
			</div>
			<div class="field">
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label class="label">Page Orientation</label>
				<div class="control">
					{#each Object.keys(PageOrientation) as key}
						<label class="radio" style="color:black">
							<input
								type="radio"
								name="orientation"
								on:click={() => {
									orientation = PageOrientation[key];
								}}
								checked={orientation === PageOrientation[key]}
							/>
							<div class="icon is-small is-left">
								<i
									class="fas {`${
										PageOrientation[key] === PageOrientation.Landscape
											? 'fa-left-right'
											: 'fa-up-down'
									}`}"
								/>
							</div>
							{key}
						</label>
					{/each}
				</div>
			</div>
			<div class="field">
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label class="label">Format</label>
				<div class="control has-icons-left">
					<div class="select is-fullwidth">
						<select bind:value={format}>
							{#each Object.keys(Format) as key}
								<option value={Format[key]}>{key}</option>
							{/each}
						</select>
					</div>
					<div class="icon is-small is-left">
						<i class="fas fa-file-pdf" />
					</div>
				</div>
			</div>
			<div class="field">
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label class="label">DPI</label>
				<div class="control has-icons-left">
					<div class="select is-fullwidth">
						<select bind:value={dpi}>
							{#each Object.keys(DPI) as key}
								<option value={DPI[key]}>{key}</option>
							{/each}
						</select>
					</div>
					<div class="icon is-small is-left">
						<i class="fas fa-braille" />
					</div>
				</div>
			</div>
		</section>
		<footer class="modal-card-foot">
			<button class="button" on:click={handleClose}>
				<span class="icon">
					<i class="fas fa-xmark" />
				</span>
				<span>Cancel</span>
			</button>
			<button class="button is-success" on:click={exportMap}>
				<span class="icon">
					<i class="fas fa-download" />
				</span>
				<span>Export</span>
			</button>
		</footer>
	</div>
</div>

<style>
	.menu-button {
		cursor: pointer;
	}
</style>

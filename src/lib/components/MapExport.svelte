<script lang="ts">
	import { onMount } from 'svelte';
	import IconButton from '@smui/icon-button';
	import { PageOrientation, Size, DPI, Format, Unit } from '$lib/map-generator';
	import type MapGenerator from '$lib/map-generator';
	import PrintableAreaManager from '$lib/printable-area-manager';
	import { map } from '$lib/stores';
	import Fa from 'svelte-fa';
	import { faFile } from '@fortawesome/free-solid-svg-icons/faFile';
	import { faRotate } from '@fortawesome/free-solid-svg-icons/faRotate';
	import { faFilePdf } from '@fortawesome/free-solid-svg-icons/faFilePdf';
	import { faImage } from '@fortawesome/free-solid-svg-icons/faImage';

	let mapGenerator: MapGenerator;
	let printableArea;
	let paperSize = Size.A4;
	let dpi = DPI[96];
	let format = Format.PNG;
	let orientation = PageOrientation.Landscape;
	let isDialogOpen = false;

	$: paperSize, updatePrintableArea();
	$: orientation, updatePrintableArea();

	$: {
		if (!isDialogOpen) {
			togglePrintableArea(false);
		}
	}

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

	const exportMap = async () => {
		const actualPaperSize = getActualPaperSize();
		await mapGenerator.generate(
			$map,
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			actualPaperSize,
			dpi,
			format,
			Unit.mm
		);
		togglePrintableArea(false);
		isDialogOpen = false;
	};
	const openMenu = () => {
		isDialogOpen = true;
		togglePrintableArea(true);
	};

	const togglePrintableArea = (state: boolean) => {
		if (state === false) {
			if (printableArea !== undefined) {
				printableArea.destroy();
				printableArea = undefined;
			}
		} else {
			printableArea = new PrintableAreaManager($map);
			updatePrintableArea();
		}
	};

	const updatePrintableArea = () => {
		if (printableArea === undefined) {
			return;
		}
		const actualPaperSize = getActualPaperSize();
		printableArea.updateArea(actualPaperSize[0], actualPaperSize[1]);
	};

	const handleClose = () => {
		togglePrintableArea(false);
		isDialogOpen = false;
	};
</script>

<IconButton class="material-icons" aria-label="Print" on:click={openMenu}>print</IconButton>

<div class="modal {isDialogOpen ? 'is-active' : ''}">
	<div class="modal-background" on:click={handleClose} />
	<div class="modal-card">
		<header class="modal-card-head">
			<p class="modal-card-title">Export</p>
			<button class="delete" aria-label="close" on:click={handleClose} />
		</header>
		<section class="modal-card-body">
			<table class="table is-narrow is-fullwidth">
				<tr>
					<td><p>Paper Size</p></td>
					<td>
						<div class="control has-icons-left">
							<div class="select is-success is-fullwidth">
								<select bind:value={paperSize}>
									{#each Object.keys(Size) as key}
										<option value={Size[key]}>{key}</option>
									{/each}
								</select>
							</div>
							<div class="icon is-small is-left">
								<Fa icon={faFile} scale={1} />
							</div>
						</div>
					</td>
				</tr>
				<tr>
					<td><p>Paper Orientation</p></td>
					<td>
						<div class="control has-icons-left">
							<div class="select is-success is-fullwidth">
								<select bind:value={orientation}>
									{#each Object.keys(PageOrientation) as key}
										<option value={PageOrientation[key]}>{key}</option>
									{/each}
								</select>
							</div>
							<div class="icon is-small is-left">
								<Fa icon={faRotate} scale={1} />
							</div>
						</div>
					</td>
				</tr>
				<tr>
					<td><p>Format</p></td>
					<td>
						<div class="control has-icons-left">
							<div class="select is-success is-fullwidth">
								<select bind:value={format}>
									{#each Object.keys(Format) as key}
										<option value={Format[key]}>{key}</option>
									{/each}
								</select>
							</div>
							<div class="icon is-small is-left">
								<Fa icon={faFilePdf} scale={1} />
							</div>
						</div>
					</td>
				</tr>
				<tr>
					<td><p>DPI</p></td>
					<td>
						<div class="control has-icons-left">
							<div class="select is-success is-fullwidth">
								<select bind:value={dpi}>
									{#each Object.keys(DPI) as key}
										<option value={DPI[key]}>{key}</option>
									{/each}
								</select>
							</div>
							<div class="icon is-small is-left">
								<Fa icon={faImage} scale={1} />
							</div>
						</div>
					</td>
				</tr>
			</table>
		</section>
		<footer class="modal-card-foot">
			<button class="button" on:click={handleClose}>Cancel</button>
			<button class="button is-success" on:click={exportMap}>Export</button>
		</footer>
	</div>
</div>

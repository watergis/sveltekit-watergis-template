<script lang="ts">
	import { onMount } from 'svelte';
	import IconButton from '@smui/icon-button';
	import Button, { Label, Icon as ButtonIcon } from '@smui/button';
	import Select, { Option } from '@smui/select';
	import Icon from '@smui/select/icon';
	import Dialog, { Title, Content, Actions } from '@smui/dialog';
	import { PageOrientation, Size, DPI, Format, Unit } from '$lib/map-generator';
	import type MapGenerator from '$lib/map-generator';
	import PrintableAreaManager from '$lib/printable-area-manager';
	import { map } from '../stores';

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
		const { default: MapGenerator } = await import('../lib/map-generator');
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

	const closeDialog = () => {
		togglePrintableArea(false);
		isDialogOpen = false;
	};
</script>

<IconButton class="material-icons" aria-label="Print" on:click={openMenu}>print</IconButton>

<Dialog
	bind:open={isDialogOpen}
	aria-labelledby="mandatory-title"
	aria-describedby="mandatory-content"
>
	<Title id="mandatory-title">Export</Title>
	<Content id="mandatory-content">
		<div style="margin: 1em; display: flex; flex-direction: column; align-items: flex-end;">
			<Select bind:value={paperSize} label="Paper Size">
				<Icon class="material-icons" slot="leadingIcon">description</Icon>
				{#each Object.keys(Size) as key}
					<Option value={Size[key]}>{key}</Option>
				{/each}
			</Select>
			<Select bind:value={orientation} label="Page Orientation">
				<Icon class="material-icons" slot="leadingIcon">screen_rotation</Icon>
				{#each Object.keys(PageOrientation) as key}
					<Option value={PageOrientation[key]}>{key}</Option>
				{/each}
			</Select>
			<Select bind:value={format} label="Format">
				<Icon class="material-icons" slot="leadingIcon">picture_as_pdf</Icon>
				{#each Object.keys(Format) as key}
					<Option value={Format[key]}>{key}</Option>
				{/each}
			</Select>
			<Select bind:value={dpi} label="DPI">
				<Icon class="material-icons" slot="leadingIcon">high_quality</Icon>
				{#each Object.keys(DPI) as key}
					<Option value={DPI[key]}>{key}</Option>
				{/each}
			</Select>
		</div>
	</Content>
	<div style="margin: 1em; display: flex; flex-direction:row; align-items: flex-end;">
		<Actions>
			<Button
				style="margin-top: 1em;"
				on:click={() => {
					closeDialog();
				}}
				variant="raised"
			>
				<ButtonIcon class="material-icons">cancel</ButtonIcon>
				<Label>Cancel</Label>
			</Button>
		</Actions>
		<Actions>
			<Button
				style="margin-top: 1em;"
				on:click={() => {
					exportMap();
				}}
				variant="raised"
			>
				<ButtonIcon class="material-icons">file_download</ButtonIcon>
				<Label>Export</Label>
			</Button>
		</Actions>
	</div>
</Dialog>

<style>
</style>

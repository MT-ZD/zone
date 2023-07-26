<script lang="ts">
	import { DateTime } from 'luxon';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import Paper from '@smui/paper';
	import Button from '@smui/button';
	import Textfield from '@smui/textfield';
	import Icon from '@smui/textfield/icon';
	import { page } from '$app/stores';
	import copy from 'copy-to-clipboard';
	import IconButton from '@smui/icon-button';

	export let data: PageData;

	let theirLiveTime = '';
	let yourLiveTime = '';

	$: theirTime = data.theirTime
		? DateTime.fromISO(data.theirTime, { setZone: true })
		: DateTime.now();
	$: yourTime = theirTime.setZone('local');

	onMount(() => {
		function setLiveTime() {
			theirLiveTime = DateTime.now()
				.setZone(theirTime.zoneName ?? 'local')
				.toLocaleString(DateTime.TIME_24_WITH_SECONDS);

			yourLiveTime = DateTime.now().toLocaleString(DateTime.TIME_24_WITH_SECONDS);

			requestAnimationFrame(setLiveTime);
		}

		setLiveTime();
	});

	let inputZone: string = '';
	let inputTime: string = '';

	function getTime() {
		goto(`?zone=${encodeURIComponent(inputZone)}&time=${inputTime}`);
	}
</script>

<svelte:head>
	<title>{yourTime.toLocaleString(DateTime.TIME_24_SIMPLE)} {yourTime.zoneName}</title>
	<meta
		property="og:title"
		content="{yourTime.toLocaleString(DateTime.TIME_24_SIMPLE)} {yourTime.zoneName}"
	/>
	<meta
		property="og:description"
		content="{theirTime.toLocaleString(
			DateTime.TIME_24_WITH_SECONDS
		)} {theirTime.zoneName} - Their time, {yourTime.toLocaleString(
			DateTime.TIME_24_WITH_SECONDS
		)} {yourTime.zoneName} - Your Time"
	/>
	<meta property="og:site_name" content="Time Zone Converter" />
	<meta property="og:image" content="/favicon.png" />
</svelte:head>

<div class="max-w-4xl w-full m-auto grid gap-4 p-8">
	<Paper class="w-full">
		<div class="text-3xl font-bold mb-4">Converted Time</div>

		<div class="grid grid-cols-2">
			<div class="grid grid-flow-row gap-2">
				<div>
					<div class="text-large mb-1 font-bold">Your Time (24h)</div>
					<div class="text-[#ff3e00] text-5xl font-black">
						{yourTime.toLocaleString(DateTime.TIME_24_SIMPLE)}
					</div>
				</div>

				<div>
					<div class="text-large mb-1 font-bold">Your Time (12h)</div>
					<div class="text-[#ff3e00] text-3xl font-black">
						{yourTime.toLocaleString(DateTime.TIME_SIMPLE)}
					</div>
				</div>

				<div>
					<div class="text-normal font-bold">Your Timezone</div>
					<div class="text-xl font-black">
						{yourTime.zoneName}
					</div>
				</div>
				<div>
					<div class="text-normal font-bold">Your current time</div>
					<div class="text-xl font-black">
						{yourLiveTime}
					</div>
				</div>
			</div>

			<div class="grid grid-flow-row gap-2">
				<div>
					<div class="text-large mb-1 font-bold">Their Time (24h)</div>
					<div class="text-[#ff3e00] text-5xl font-black">
						{theirTime.toLocaleString(DateTime.TIME_24_SIMPLE)}
					</div>
				</div>

				<div>
					<div class="text-large mb-1 font-bold">Their Time (12h)</div>
					<div class="text-[#ff3e00] text-3xl font-black">
						{theirTime.toLocaleString(DateTime.TIME_SIMPLE)}
					</div>
				</div>

				<div>
					<div class="text-normal font-bold">Their Timezone</div>
					<div class="text-xl font-black">
						{theirTime.zoneName}
					</div>
				</div>
				<div>
					<div class="text-normal font-bold">Their current time</div>
					<div class="text-xl font-black">
						{theirLiveTime}
					</div>
				</div>
			</div>
		</div>
	</Paper>

	<Paper class="w-full">
		<div class="text-lg font-bold mb-4">Get Your Time</div>
		<form
			on:submit|preventDefault={getTime}
			class="grid grid-flow-row md:grid-flow-col gap-4 md:gap-2 items-center"
		>
			<Textfield
				required
				variant="filled"
				class="w-full"
				bind:value={inputZone}
				label="Timezone"
				type="text"
			>
				<Icon class="material-icons" slot="leadingIcon">public</Icon>
			</Textfield>
			<Textfield
				required
				variant="filled"
				class="w-full"
				bind:value={inputTime}
				label="Time"
				type="time"
			>
				<Icon class="material-icons" slot="leadingIcon">schedule</Icon>
			</Textfield>
			<Button class="md:ml-4 md:mt-0 mt-4" variant="raised" type="submit">Get Time!</Button>
		</form>
		<Textfield
			input$readonly
			variant="filled"
			class="w-full mt-4"
			value={$page.url.href}
			label="URL"
			type="text"
		>
			<IconButton on:click={() => copy($page.url.href)} class="material-icons" slot="trailingIcon">
				content_copy
			</IconButton>
		</Textfield>
	</Paper>
	<div class="text-gray-500 text-sm">
		Created by Mateusz Zdrzałek&nbsp;-&nbsp;<a
			href="https://mtzd.pro"
			class="hover:!text-[#ff3e00] underline !text-inherit"
			target="_blank"
		>
			mtzd.pro
		</a>

		&nbsp;|<img src="/github-mark-white.svg" alt="GitHub logo" class="h-4 inline mx-2" />

		<a
			href="https://github.com/MT-ZD/zone"
			class="hover:!text-[#ff3e00] underline !text-inherit"
			target="_blank"
		>
			GitHub Project
		</a>
	</div>
</div>

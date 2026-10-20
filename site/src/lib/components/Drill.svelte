<script lang="ts">
	import { getCetasika } from '#lib/cetasikas';
	import type { Confusion } from '#lib/types';
	import { tick } from 'svelte';

	type Item = {
		id: string;
		label: string;
		scene: string;
		read: string;
		tell: string;
	};

	let { confusion }: { confusion: Confusion } = $props();

	const items = $derived.by(() => {
		const ids = confusion.drillIds ?? confusion.members.map((member) => member.id);
		return ids.map((id) => {
			const factor = getCetasika(id);
			const member = confusion.members.find((item) => item.id === id);
			if (!factor || !member) throw new Error(`Missing drill factor ${id}`);
			return {
				id,
				label: `${factor.pali} — ${factor.gloss}`,
				scene: factor.example.scene,
				read: factor.example.read,
				tell: member.tell
			} satisfies Item;
		});
	});

	let cursor = $state(0);
	let picked = $state<string | null>(null);
	let nextButton = $state<HTMLButtonElement | null>(null);
	const current = $derived(items[cursor % items.length]);
	const pickedItem = $derived(items.find((item) => item.id === picked));

	async function choose(id: string) {
		picked = id;
		await tick();
		nextButton?.focus();
	}

	function next() {
		cursor += 1;
		picked = null;
	}
</script>

<section class="drill">
	<h2>Which one is this?</h2>
	{#if confusion.drillNote}
		<p class="drill-note">{confusion.drillNote}</p>
	{/if}
	<blockquote>
		<p>{current.scene}</p>
	</blockquote>
	<div class="drill-options" role="group" aria-label="Possible factors">
		{#each items as item (item.id)}
			<button
				type="button"
				aria-pressed={picked === item.id}
				disabled={picked !== null}
				class={{
					right: picked !== null && item.id === current.id,
					wrong: picked === item.id && picked !== current.id
				}}
				onclick={() => choose(item.id)}
			>
				<span lang="pi">{item.label.split(' — ')[0]}</span>
				<span>{item.label.split(' — ')[1]}</span>
			</button>
		{/each}
	</div>
	{#if picked && pickedItem}
		<div class="drill-result" aria-live="polite">
			<p class="drill-verdict">{picked === current.id ? 'Yes.' : `This moment is ${current.label}.`}</p>
			<p>{current.read}</p>
			<p>{current.tell}</p>
			{#if picked !== current.id}
				<p class="drill-other">
					<strong>{pickedItem.label}.</strong>
					{pickedItem.tell}
				</p>
			{/if}
			<button type="button" class="button button-quiet" bind:this={nextButton} onclick={next}>
				Next moment
			</button>
		</div>
	{/if}
</section>

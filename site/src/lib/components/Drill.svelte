<script lang="ts">
	import { getCetasika } from '#lib/cetasikas';
	import type { Confusion } from '#lib/types';
	import { onMount, tick } from 'svelte';

	type Item = {
		id: string;
		pali: string;
		gloss: string;
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
				pali: factor.pali,
				gloss: factor.gloss,
				scene: factor.example.scene,
				read: factor.example.read,
				tell: member.tell
			} satisfies Item;
		});
	});

	// Scenes are asked in a shuffled order, so the answer is not always the
	// option in the same position. The prerendered HTML uses sheet order; the
	// shuffle happens once the page is live.
	let mounted = $state(false);
	onMount(() => {
		mounted = true;
	});

	function shuffled(count: number, avoidFirst?: number): number[] {
		const order = Array.from({ length: count }, (_, index) => index);
		for (let index = count - 1; index > 0; index -= 1) {
			const swap = Math.floor(Math.random() * (index + 1));
			[order[index], order[swap]] = [order[swap], order[index]];
		}
		// Do not repeat the scene that just ended the previous round.
		if (count > 1 && order[0] === avoidFirst) [order[0], order[1]] = [order[1], order[0]];
		return order;
	}

	// Writable deriveds: each resets when the drill moves to another mix-up.
	let order = $derived(mounted ? shuffled(items.length) : items.map((_, index) => index));
	let step = $derived.by(() => fresh(0));
	let picked = $derived.by(() => fresh<string | null>(null));
	let score = $derived.by(() => fresh(0));

	// Reads confusion.id so the deriveds above depend on it and reset with it.
	function fresh<T>(value: T): T {
		void confusion.id;
		return value;
	}

	let nextButton = $state<HTMLButtonElement | null>(null);
	let scene = $state<HTMLElement | null>(null);
	const current = $derived(items[order[step] ?? 0]);
	const pickedItem = $derived(items.find((item) => item.id === picked));
	const lastStep = $derived(step === items.length - 1);

	async function choose(id: string) {
		picked = id;
		if (id === current.id) score += 1;
		await tick();
		nextButton?.focus();
	}

	async function next() {
		if (lastStep) {
			order = shuffled(items.length, order[step]);
			step = 0;
			score = 0;
		} else {
			step += 1;
		}
		picked = null;
		await tick();
		scene?.focus();
	}
</script>

<section class="drill">
	<h2>Which one is this?</h2>
	{#if confusion.drillNote}
		<p class="drill-note">{confusion.drillNote}</p>
	{/if}
	<p class="drill-progress">Moment {step + 1} of {items.length}</p>
	<blockquote bind:this={scene} tabindex="-1">
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
				<span lang="pi">{item.pali}</span>
				<span>{item.gloss}</span>
			</button>
		{/each}
	</div>
	<div aria-live="polite">
		{#if pickedItem}
			<div class="drill-result">
				<p class="drill-verdict">
					{#if pickedItem.id === current.id}
						Yes.
					{:else}
						This moment is <span lang="pi">{current.pali}</span> — {current.gloss}.
					{/if}
				</p>
				<p>{current.read}</p>
				<p>{current.tell}</p>
				{#if pickedItem.id !== current.id}
					<p class="drill-other">
						<strong><span lang="pi">{pickedItem.pali}</span> — {pickedItem.gloss}.</strong>
						{pickedItem.tell}
					</p>
				{/if}
				{#if lastStep}
					<p class="drill-score">You named {score} of {items.length} this round.</p>
				{/if}
			</div>
		{/if}
	</div>
	{#if pickedItem}
		<button type="button" class="button button-quiet" bind:this={nextButton} onclick={next}>
			{lastStep ? 'Start again' : 'Next moment'}
		</button>
	{/if}
</section>

<style>
	.drill-progress {
		margin: 0 0 0.4rem;
		color: var(--muted);
		font-size: 0.86rem;
	}

	.drill-score {
		font-weight: 600;
	}

	blockquote:focus {
		outline: none;
	}

	blockquote:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 4px;
		border-radius: 0.3rem;
	}
</style>

<script lang="ts">
	import { tick } from 'svelte';
	import {
		answersOf,
		cittasFor,
		familyOf,
		fitsAnswers,
		fullLabel,
		getCitta,
		groupOf,
		presetIds,
		questions,
		type Answers,
		type Question,
		type Reckoning
	} from '#lib/combinations';
	import type { CittaRow } from '#lib/types';

	type Props = {
		reckoning: Reckoning;
		cittaId: string | null;
		onselect: (id: string | null, note?: string) => void;
	};
	let { reckoning, cittaId, onselect }: Props = $props();

	const NONE = '__none';
	const key = (v: string | null) => v ?? NONE;

	// Answers typed while no single citta is chosen; a chosen citta (preset, matrix, link) fills every answer.
	let draft = $state.raw<Answers>({});
	const chosen = $derived(cittaId ? getCitta(cittaId) : undefined);
	const answers = $derived(chosen ? answersOf(chosen) : draft);

	const all = $derived(cittasFor(reckoning));
	type Step = { q: Question; values: string[]; chosen: string | undefined; sample: CittaRow };
	const flow = $derived.by(() => {
		const steps: Step[] = [];
		let pool = all;
		for (const q of questions) {
			const values = [...new Set(pool.map((c) => key(q.value(c))))];
			const answered = q.id in answers && values.includes(key(answers[q.id] ?? null));
			if (values.length > 1) {
				steps.push({ q, values, chosen: answered ? key(answers[q.id] ?? null) : undefined, sample: pool[0] });
				if (!answered) break;
			}
			if (answered) pool = pool.filter((c) => q.value(c) === answers[q.id]);
		}
		return { steps, pool };
	});

	// Presets show a short name; the full label is the accessible name and tooltip.
	const short = (c: CittaRow) => {
		if (groupOf(c).section.id === 'ahetuka') return c.label.charAt(0).toUpperCase() + c.label.slice(1);
		return familyOf(c).label;
	};

	function pick(q: Question, value: string) {
		const order = questions.map((x) => x.id);
		const next: Answers = {};
		for (const id of order.slice(0, order.indexOf(q.id))) if (id in answers) next[id] = answers[id];
		next[q.id] = value === NONE ? null : value;
		draft = next;
		const pool = all.filter((c) => fitsAnswers(c, next));
		if (pool.length === 1) onselect(pool[0].id);
		else onselect(null, `${pool.length} cittas match.`);
	}

	const anyAnswered = $derived(flow.steps.some((s) => s.chosen !== undefined));
	let stepsEl: HTMLElement | undefined = $state();
	async function startOver() {
		draft = {};
		onselect(null, 'Answers cleared. Choose the first question again.');
		// The button leaves with the answers; keep focus in the flow, on the first question.
		await tick();
		stepsEl?.querySelector('select')?.focus();
	}

	const optionText = (q: Question, v: string) => {
		if (v === NONE) return "The sheets don't specify";
		const l = q.label(v);
		return l.pali ? `${l.plain} · ${l.pali}` : l.plain;
	};
	const matchText = $derived(flow.pool.length === 1 ? 'One citta matches.' : `${flow.pool.length} cittas match.`);
	// Offer the matches as buttons, including a lone match not yet chosen (e.g. after a reckoning change).
	const showCandidates = $derived(flow.pool.length <= 12 && !(flow.pool.length === 1 && flow.pool[0].id === cittaId));

	const presets = $derived(presetIds.map((p) => getCitta(p[reckoning])).filter((c): c is CittaRow => !!c));
</script>

<section class="composer" aria-labelledby="composer-title">
	<h2 id="composer-title" class="visually-hidden">Choose a mind-moment</h2>
	<div class="presets">
		<p class="q-title" id="presets-title">Start from</p>
		<ul aria-labelledby="presets-title">
			{#each presets as c (c.id)}
				<li>
					<button type="button" aria-pressed={cittaId === c.id} aria-label={fullLabel(c)} title={fullLabel(c)} onclick={() => onselect(c.id)}
						>{short(c)}</button
					>
				</li>
			{/each}
		</ul>
	</div>

	<details class="build">
		<summary>Build your own moment <span class="sum-note">{matchText}</span></summary>
		<ol class="steps" bind:this={stepsEl}>
			{#each flow.steps as step (step.q.id)}
				<li>
					<label>
						<span class="q-title">{step.q.title(step.sample)}</span>
						<select value={step.chosen ?? ''} class={{ pending: step.chosen === undefined }} onchange={(e) => pick(step.q, e.currentTarget.value)}>
							{#if step.chosen === undefined}<option value="" disabled>Choose…</option>{/if}
							{#each step.values as v (v)}
								<option value={v}>{optionText(step.q, v)}</option>
							{/each}
						</select>
					</label>
				</li>
			{/each}
		</ol>
		{#if anyAnswered}
			<button type="button" class="reset" onclick={startOver}>Start over</button>
		{/if}
		{#if showCandidates}
			<ul class="candidates" aria-label="Matching cittas">
				{#each flow.pool as c (c.id)}
					<li><button type="button" onclick={() => onselect(c.id)}>{fullLabel(c)}</button></li>
				{/each}
			</ul>
		{/if}
	</details>
</section>

<style>
	.composer {
		margin: 0;
		container-type: inline-size;
	}
	ul,
	ol {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.presets ul,
	.candidates {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
	}
	.presets button,
	.candidates button {
		padding: 0.25rem 0.7rem;
		font-size: 0.86rem;
		text-align: left;
	}
	.candidates button {
		border-radius: 10px;
	}
	button[aria-pressed='true'] {
		background: var(--ink);
		color: var(--bg-raised);
		box-shadow: none;
	}
	.q-title {
		display: block;
		margin: 0 0 0.3rem;
		font-size: 0.74rem;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.build {
		margin-top: 0.8rem;
	}
	.build summary {
		cursor: pointer;
		font-weight: 600;
		font-size: 0.95rem;
		color: var(--accent);
	}
	.sum-note {
		font-weight: 400;
		color: var(--muted);
		font-size: 0.85rem;
		margin-left: 0.3rem;
	}
	.build[open] summary {
		margin-bottom: 0.7rem;
	}
	.steps {
		display: grid;
		gap: 0.4rem;
	}
	label {
		display: grid;
		grid-template-columns: 6.5rem minmax(0, 1fr);
		align-items: center;
		gap: 0.6rem;
	}
	label .q-title {
		margin: 0;
	}
	/* In the narrow side column the option text needs the full width. */
	@container (max-width: 380px) {
		label {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.2rem;
		}
	}
	select {
		width: 100%;
		font: inherit;
		font-size: 0.88rem;
		padding: 0.35rem 0.5rem;
		border: 0;
		border-radius: 8px;
		background: var(--bg-raised);
		color: var(--ink);
		box-shadow: inset 0 0 0 1px var(--line);
	}
	select.pending {
		box-shadow: inset 0 0 0 1.5px var(--accent);
	}
	.candidates {
		margin-top: 0.7rem;
	}
	.reset {
		margin-top: 0.6rem;
		padding: 0.2rem 0.7rem;
		font-size: 0.82rem;
		color: var(--muted);
	}
</style>

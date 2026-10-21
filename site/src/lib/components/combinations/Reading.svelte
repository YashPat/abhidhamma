<script lang="ts">
	import { tick } from 'svelte';
	import { getCetasika } from '#lib/cetasikas';
	import { groupMeta } from '#lib/labels';
	import {
		factorsIn,
		feelingLabel,
		fullLabel,
		groupOf,
		jatiLabel,
		maxTogether,
		notableAbsences,
		pali,
		planeLabel,
		reachOf,
		rulesFor,
		stateOf,
		vkPlain,
		type CittaSection,
		type Reckoning,
		type ToggleResult
	} from '#lib/combinations';
	import type { CittaRow } from '#lib/types';

	type Props = {
		citta: CittaRow | undefined;
		reckoning: Reckoning;
		on: Set<string>;
		lastEffect: ToggleResult['effect'] | null;
		factorId: string | null;
		ontoggle: (id: string) => void;
		onback: () => void;
		oninspect: (id: string) => void;
	};
	let { citta, reckoning, on, lastEffect, factorId, ontoggle, onback, oninspect }: Props = $props();

	const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

	// Section anchors on the sampayoga sheet's "Saṅgaha — Citta by Citta" headings.
	const sampayogaAnchor: Record<CittaSection['id'], string> = {
		akusala: '1-akusala-citta-unwholesome',
		ahetuka: '2-ahetuka-citta-rootless',
		'kama-sobhana': '3-kamavacara-sobhana-citta-beautiful-sense-sphere',
		rupa: '4-mahaggata-citta-sublime',
		arupa: '4-mahaggata-citta-sublime',
		lokuttara: '5-lokuttara-citta-supramundane'
	};

	const place = $derived(citta ? groupOf(citta) : null);
	const fixedList = $derived(citta ? factorsIn(citta, 'F') : []);
	const optionalList = $derived(citta ? factorsIn(citta, 'O') : []);
	const most = $derived(citta ? maxTogether(citta) : 0);
	const momentCount = $derived(fixedList.length + optionalList.filter((id) => on.has(id)).length);
	const absences = $derived(citta ? notableAbsences(citta) : []);
	const virati = ['samma-vaca', 'samma-kammanta', 'samma-ajiva'];
	const illimitables = ['karuna', 'mudita'];
	/** The sheets are silent on whether a virati and an illimitable co-arise; say so wherever it matters. */
	const mixesViratiAndIllimitable = $derived(
		optionalList.some((id) => virati.includes(id)) && optionalList.some((id) => illimitables.includes(id))
	);
	const bothIncluded = $derived([...on].some((id) => virati.includes(id)) && [...on].some((id) => illimitables.includes(id)));

	const factor = $derived(factorId ? getCetasika(factorId) : undefined);
	const reach = $derived(factorId ? reachOf(reckoning, factorId) : null);
	const factorRules = $derived(factorId ? rulesFor(factorId) : []);
	const factorState = $derived(citta && factorId ? stateOf(citta, factorId) : null);
	const stateText = { F: 'fixed: present whenever this citta arises', O: 'may arise: optional (aniyata) here', '-': 'not in this citta' } as const;
	// Kept here so the disclosures stay as the reader left them across factor inspections.
	let buildOpen = $state(false);
	let rulesOpen = $state(false);
	let absentOpen = $state(false);
	// The sheets name the third beautiful root wisdom (paññā), not amoha.
	const rootName: Record<string, { plain: string; pali: string }> = {
		lobha: { plain: 'greed', pali: 'lobha' },
		dosa: { plain: 'hatred', pali: 'dosa' },
		moha: { plain: 'delusion', pali: 'moha' },
		alobha: { plain: 'non-greed', pali: 'alobha' },
		adosa: { plain: 'non-hatred', pali: 'adosa' },
		amoha: { plain: 'wisdom', pali: 'paññā' }
	};
	const rootList = (r: string) => (r === 'none' ? [] : r.split('+').map((x) => rootName[x] ?? { plain: x, pali: x }));
	let title: HTMLElement | undefined = $state();
	/** The clicked button leaves the DOM when the view switches; land focus on the new heading instead. */
	async function inspectFromReading(id: string) {
		oninspect(id);
		await tick();
		title?.focus();
	}
	/** Figures this explorer computes on 89 where the sheet prints the jhāna-wise (121) figure. */
	const jhanaWise: Record<string, number> = { vicara: 66, piti: 51 };
</script>

{#snippet effectNote(effect: NonNullable<ToggleResult['effect']>)}
	<blockquote class="effect">
		<p>
			{effect.turnedOn ? 'Also turned on' : 'Turned off'}:
			{#each effect.changed as id, i (id)}{i > 0 ? ', ' : ''}<span lang="pi">{pali(id)}</span>{/each}.
			“{effect.rule.quote}”
		</p>
		<cite>{effect.rule.source}</cite>
	</blockquote>
{/snippet}

<section class="reading" aria-labelledby="reading-title">
	{#if factor && reach}
		<div class="inspect">
			<p class="kicker">Factor · {groupMeta[factor.group].label}</p>
			<h2 id="reading-title" tabindex="-1" bind:this={title}><span lang="pi">{factor.pali}</span></h2>
			<p class="gloss">{factor.gloss}</p>
			{#if citta && factorState}
				<p class="in-moment">
					In <em>{fullLabel(citta)}</em>: <strong>{stateText[factorState]}</strong>{factorState === 'O' && on.has(factor.id) ? ', and included in this moment' : ''}.
				</p>
				{#if factorState === 'O'}
					<button type="button" class="include" aria-pressed={on.has(factor.id)} onclick={() => ontoggle(factor.id)}>
						{on.has(factor.id) ? 'Included in this moment' : 'Include in this moment'}
					</button>
					{#if lastEffect}
						{@render effectNote(lastEffect)}
					{/if}
				{/if}
			{/if}
			<p class="reach">
				Arises in <strong>{reach.total}</strong> of {reckoning} cittas: fixed in {reach.fixed}, may arise in {reach.optional}.
				<span class="hint">The matrix below shows where.</span>
			</p>
			{#if reckoning === 89 && factor.id in jhanaWise}
				<p class="hint derived">
					<span class="tag">derived</span> {reach.total} is this explorer's count on the 89 reckoning. The sheet's
					{jhanaWise[factor.id]} counts the supramundane jhāna by jhāna (the 121 reckoning); switch to 121 to see it.
				</p>
			{/if}
			{#if factorRules.length}
				<details class="more" bind:open={rulesOpen}>
					<summary>Rules it is in <span class="count">{factorRules.length}</span></summary>
					<ul class="rules">
						{#each factorRules as r (r.id)}
							<li>
								<strong>{r.title}.</strong> “{r.quote}” <cite>{r.source}</cite>
							</li>
						{/each}
					</ul>
				</details>
			{:else}
				<p class="hint">No exclusivity rule in the sheets names this factor.</p>
			{/if}
			<p class="links">
				<a href="/cetasikas/{factor.id}">Read the factor →</a>
				<button type="button" class="back" onclick={onback}>{citta ? 'Back to the moment' : 'Close'} <kbd>Esc</kbd></button>
			</p>
		</div>
	{:else if citta && place}
		<p class="kicker">{place.section.label} · {place.group.label}</p>
		<h2 id="reading-title" tabindex="-1" bind:this={title}>{cap(citta.label)}</h2>
		<p class="pali-name" lang="pi">{place.section.pali} · {place.group.pali}</p>

		<div class="numbers">
			<p class="big"><strong>{fixedList.length}</strong> fixed <span aria-hidden="true">·</span> <strong>{optionalList.length}</strong> may arise</p>
			<p class="total">
				The sheet's total: {citta.sheetTotal}.
				{#if most < citta.sheetTotal}
					The sheet's total counts every factor that can be found in this citta; the one-at-a-time rules mean a single
					moment holds at most {most} <span class="tag">derived</span>{#if mixesViratiAndIllimitable}, if an abstinence and
						an illimitable can share a moment, which the sheets don't say{/if}.
				{/if}
			</p>
		</div>

		<dl class="tags">
			<div><dt>Plane</dt><dd>{planeLabel[citta.plane]}</dd></div>
			<div><dt>Quality</dt><dd>{jatiLabel[citta.jati]}</dd></div>
			<div>
				<dt>Roots</dt>
				<dd>
					{#each rootList(citta.roots) as r, i (r.pali)}{i > 0 ? ' + ' : ''}{r.plain} (<span lang="pi">{r.pali}</span>){:else}none (rootless){/each}
				</dd>
			</div>
			<div>
				<dt>Feeling</dt>
				<dd>{feelingLabel[citta.feeling] ?? citta.feeling}{#if citta.feelingInferred}<em> (inferred)</em>{/if}</dd>
			</div>
			<div>
				<dt>View / knowledge</dt>
				<dd>
					{#if citta.vk}{vkPlain[citta.vk] ?? citta.vk} (<span lang="pi">{citta.vk}</span>){#if citta.vkInferred}<em> (inferred)</em>{/if}{:else if citta.roots === 'none'}neither (rootless: no wrong view and no wisdom){:else}the sheets don't specify{/if}
				</dd>
			</div>
			<div><dt>Prompting</dt><dd>{citta.prompting ?? "the sheets don't specify"}</dd></div>
		</dl>

		{#if optionalList.length === 0}
			<p class="hint fixed-only">Every factor in this citta is fixed. This moment: {momentCount} factors.</p>
		{:else}
			<details class="more" bind:open={buildOpen}>
				<summary>Build this moment <span class="count">{momentCount} factors</span></summary>
				<p class="hint">Switch on the optional factors present in one moment. The wheel follows.</p>
				<ul class="toggles">
					{#each optionalList as id (id)}
						<li>
							<button type="button" aria-pressed={on.has(id)} aria-label="{pali(id)}, optional factor" onclick={() => ontoggle(id)}>
								<span class="glyph" aria-hidden="true">{on.has(id) ? '●' : '◌'}</span><span lang="pi">{pali(id)}</span>
							</button>
						</li>
					{/each}
				</ul>
				{#if lastEffect}
					{@render effectNote(lastEffect)}
				{/if}
				{#if bothIncluded}
					<p class="hint silent">
						The sheets don't say whether an abstinence and an illimitable can arise in the same moment. This explorer
						does not forbid it, and does not claim it.
					</p>
				{/if}
				<p class="result">This moment: <strong>{momentCount}</strong> factors ({fixedList.length} fixed, {momentCount - fixedList.length} chosen).</p>
			</details>
		{/if}

		{#if absences.length}
			<details class="more absent" bind:open={absentOpen}>
				<summary>Notably absent <span class="count">{absences.length}</span></summary>
				<ul>
					{#each absences as a (a.text)}
						<li>
							{#each a.factors as f (f)}<button type="button" class="link-button" onclick={() => inspectFromReading(f)}><span lang="pi">{pali(f)}</span></button>{/each}
							{a.text}
							{#if a.rule}<span class="quote">“{a.rule.quote}”</span>{/if}
							<cite>{a.source}</cite>
						</li>
					{/each}
				</ul>
			</details>
		{/if}

		<p class="links">
			From <a href="/sheets/citta">the citta sheet</a> and
			<a href="/sheets/sampayoga#{sampayogaAnchor[place.section.id]}">the sampayoga sheet</a>.
		</p>
	{:else}
		<h2 id="reading-title" tabindex="-1" bind:this={title}>No moment chosen</h2>
		<p class="hint">
			Pick a starting point or answer the questions. The wheel then shows which of the 52 factors this citta always
			has, which it may have, and which it never has.
		</p>
	{/if}
</section>

<style>
	.reading {
		margin: 0;
	}
	h2 {
		margin: 0.15rem 0 0;
		font-size: 1.55rem;
		line-height: 1.2;
	}
	.kicker {
		margin: 0;
		font-size: 0.76rem;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.pali-name,
	.gloss {
		margin: 0.15rem 0 0;
		font-family: var(--serif);
		font-style: italic;
		color: var(--muted);
	}
	.gloss {
		font-style: normal;
		font-size: 1.1rem;
		color: var(--ink);
	}
	.numbers {
		margin-top: 0.9rem;
	}
	.big {
		margin: 0;
		font-size: 1.1rem;
	}
	.big strong {
		font-size: 2.1rem;
		font-family: var(--serif);
	}
	.tags {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.2rem 0.9rem;
		margin: 1rem 0 0;
		padding: 0.8rem 0 0;
		border-top: 1px solid var(--line);
		font-size: 0.9rem;
	}
	.tags div {
		display: contents;
	}
	.tags dt {
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--muted);
		padding-top: 0.15rem;
	}
	.tags dd {
		margin: 0;
	}
	.total,
	.hint,
	.result,
	.reach .hint {
		margin: 0.3rem 0 0;
		font-size: 0.88rem;
		color: var(--muted);
	}
	.result {
		color: var(--ink);
	}
	.tag {
		display: inline-block;
		padding: 0 0.35rem;
		border: 1px solid var(--line);
		border-radius: 4px;
		font-size: 0.7rem;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.fixed-only {
		margin-top: 0.9rem;
	}
	.more {
		margin-top: 0.9rem;
		border-top: 1px solid var(--line);
		padding-top: 0.7rem;
	}
	.more summary {
		cursor: pointer;
		font-family: var(--serif);
		font-weight: 600;
		font-size: 1rem;
	}
	.more[open] summary {
		margin-bottom: 0.4rem;
	}
	.count {
		font-family: var(--sans);
		font-weight: 400;
		font-size: 0.82rem;
		color: var(--muted);
		margin-left: 0.25rem;
	}
	.toggles {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
		list-style: none;
		margin: 0.5rem 0 0;
		padding: 0;
	}
	.toggles button,
	.include {
		padding: 0.28rem 0.7rem;
		font-size: 0.88rem;
		transition: background-color 250ms ease;
	}
	.toggles button[aria-pressed='true'],
	.include[aria-pressed='true'] {
		background: var(--ink);
		color: var(--bg-raised);
		box-shadow: none;
	}
	.glyph {
		display: inline-block;
		width: 1em;
		margin-right: 0.25rem;
	}
	.effect {
		margin: 0.6rem 0 0;
		padding: 0.5rem 0.8rem;
		border-left: 3px solid var(--accent);
		background: var(--soft);
		font-size: 0.88rem;
	}
	.effect p {
		margin: 0;
	}
	cite {
		display: block;
		font-size: 0.78rem;
		color: var(--muted);
		font-style: normal;
	}
	.absent ul,
	.rules {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.55rem;
		font-size: 0.88rem;
	}
	.quote {
		display: block;
		font-family: var(--serif);
		font-style: italic;
		color: var(--muted);
	}
	.link-button {
		padding: 0;
		background: none;
		box-shadow: none;
		color: var(--accent);
		text-decoration: underline;
		font-weight: 600;
		margin-right: 0.3em;
	}
	h2:focus {
		outline: none;
	}
	h2:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}
	.links {
		margin: 1rem 0 0;
		font-size: 0.86rem;
		color: var(--muted);
	}
	.in-moment {
		margin: 0.8rem 0 0.5rem;
	}
	.reach {
		margin: 0.9rem 0 0;
	}
	.inspect .links {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.6rem 1rem;
	}
	.back {
		padding: 0.3rem 0.75rem;
		font-size: 0.88rem;
	}
	kbd {
		font-family: var(--sans);
		font-size: 0.75rem;
		border: 1px solid var(--line);
		border-radius: 4px;
		padding: 0 0.3rem;
		color: var(--muted);
	}
	.inspect {
		animation: fade 250ms ease;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.inspect {
			animation: none;
		}
		.toggles button,
		.include {
			transition: none;
		}
	}
</style>

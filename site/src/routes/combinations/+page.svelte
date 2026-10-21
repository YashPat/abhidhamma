<script lang="ts">
	import { tick, untrack } from 'svelte';
	import { afterNavigate, goto } from '$app/navigation';
	import { page } from '$app/state';
	import { getCetasika } from '#lib/cetasikas';
	import {
		counterpart,
		cittasFor,
		factorsIn,
		familyOf,
		fullLabel,
		getCitta,
		pali,
		presetIds,
		reachOf,
		somanassaCount,
		toggleOptional,
		type Reckoning,
		type Rule,
		type ToggleResult
	} from '#lib/combinations';
	import Wheel from '#lib/components/combinations/Wheel.svelte';
	import Composer from '#lib/components/combinations/Composer.svelte';
	import Reading from '#lib/components/combinations/Reading.svelte';
	import Matrix from '#lib/components/combinations/Matrix.svelte';
	import RuleCards from '#lib/components/combinations/RuleCards.svelte';

	const DEFAULT = presetIds[0][89];
	const HASH_KEYS = ['r', 'c', 'f', 'o'];

	let reckoning = $state<Reckoning>(89);
	let cittaId = $state<string | null>(DEFAULT);
	let factorId = $state<string | null>(null);
	let on = $state.raw<Set<string>>(new Set());
	let lastEffect = $state.raw<ToggleResult['effect'] | null>(null);
	let highlight = $state.raw<string[]>([]);
	let shownRule = $state<string | null>(null);
	let ready = $state(false);
	let announce = $state('');
	let layoutEl: HTMLElement | undefined = $state();
	let wheelEl: HTMLElement | undefined = $state();
	let readingEl: HTMLElement | undefined = $state();

	const citta = $derived(cittaId ? getCitta(cittaId) : undefined);
	const centre = $derived(citta ? familyOf(citta).pali : '');

	const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const wide = () => window.matchMedia('(min-width: 1000px)').matches;
	const scrollTo = (el: HTMLElement | undefined) => el?.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });

	function describeCitta(id: string) {
		const c = getCitta(id);
		if (!c) return '';
		return `${fullLabel(c)}. ${factorsIn(c, 'F').length} fixed, ${factorsIn(c, 'O').length} may arise.`;
	}

	function selectCitta(id: string | null, note = '') {
		if (id !== cittaId) {
			cittaId = id;
			on = new Set();
			lastEffect = null;
		}
		announce = id ? describeCitta(id) : note || 'No moment chosen.';
	}
	async function focusDot(id: string | null) {
		await tick();
		const dot = id ? document.querySelector<SVGElement>(`.wheel g.dot[data-id="${id}"]`) : null;
		if (dot && dot.getClientRects().length) dot.focus();
		else document.getElementById('reading-title')?.focus();
	}
	function inspect(id: string) {
		factorId = factorId === id ? null : id;
		highlight = [];
		shownRule = null;
		if (factorId) {
			const r = reachOf(reckoning, factorId);
			announce = `${pali(factorId)}: arises in ${r.total} of ${reckoning} cittas, fixed in ${r.fixed}, may arise in ${r.optional}.`;
			// On narrow screens the reading sits below the wheel: bring it into view so the tap visibly did something.
			if (!wide()) tick().then(() => scrollTo(readingEl));
		} else announce = 'Back to the moment.';
	}
	function backToMoment() {
		const was = factorId;
		factorId = null;
		highlight = [];
		shownRule = null;
		announce = citta ? `Back to ${fullLabel(citta)}.` : 'Factor closed.';
		focusDot(was);
	}
	function toggle(id: string) {
		if (!citta) return;
		const result = toggleOptional(citta, on, id);
		on = result.on;
		lastEffect = result.effect ?? null;
		const now = on.has(id) ? 'included' : 'left out';
		const extra = lastEffect
			? ` ${lastEffect.turnedOn ? 'Also turned on' : 'Turned off'}: ${lastEffect.changed.map(pali).join(', ')}. “${lastEffect.rule.quote}”`
			: '';
		announce = `${pali(id)} ${now}.${extra}`;
	}
	function setReckoning(r: Reckoning) {
		if (r === reckoning) return;
		reckoning = r;
		// The same citta on the other reckoning: a supramundane citta maps to or from its first-jhāna form.
		const next = cittaId ? counterpart(cittaId, r) : null;
		const moved = next !== cittaId;
		if (moved) {
			cittaId = next;
			on = new Set();
			lastEffect = null;
		}
		announce = `${r} cittas.${moved && next ? ` ${describeCitta(next)}` : ''}`;
	}
	function showRule(rule: Rule, id: string) {
		factorId = id;
		highlight = rule.factors;
		shownRule = rule.id;
		announce = `${rule.title}. Showing ${rule.factors.map(pali).join(' and ')} on the wheel; the reading shows ${pali(id)}.`;
		// On wide screens the wheel is sticky: scroll to the top of the layout so it shows whole below the nav.
		scrollTo(wide() ? layoutEl : wheelEl);
	}

	// The URL already carries the moment (see canonicalUrl); this just puts it on the clipboard.
	let copied = $state(false);
	let copiedTimer: ReturnType<typeof setTimeout> | undefined;
	async function copyLink() {
		try {
			await navigator.clipboard.writeText(window.location.origin + canonicalUrl());
			copied = true;
			announce = 'Link copied. It opens this citta, its included factors, and any inspected factor.';
			clearTimeout(copiedTimer);
			copiedTimer = setTimeout(() => (copied = false), 2000);
		} catch {
			announce = 'Could not copy. The address bar holds the same link.';
		}
	}

	/** From the matrix below: scroll the wheel back into view and land focus on the reading's heading. */
	function reveal() {
		scrollTo(wide() ? layoutEl : wheelEl);
		document.getElementById('reading-title')?.focus({ preventScroll: true });
	}

	function onkeydown(event: KeyboardEvent) {
		if (event.key !== 'Escape' || event.defaultPrevented) return;
		if (event.target instanceof Element && event.target.closest('select, input, textarea')) return;
		if (factorId || highlight.length) backToMoment();
	}

	/** Restore state from the hash. A hash with none of our keys (the skip link's #content) is left alone. */
	function readHash() {
		const raw = window.location.hash.slice(1);
		const params = new URLSearchParams(raw);
		if (raw && !HASH_KEYS.some((k) => params.has(k))) return;
		const c = params.get('c');
		// A 121-only id with no r= still means the 121 reckoning.
		let r: Reckoning = params.get('r') === '121' ? 121 : 89;
		if (!params.has('r') && c && !cittasFor(89).some((row) => row.id === c) && cittasFor(121).some((row) => row.id === c)) r = 121;
		reckoning = r;
		// `c=` (empty) keeps a cleared selection; no hash at all is the default.
		cittaId = !raw ? DEFAULT : c ? counterpart(c, r) : null;
		const f = params.get('f');
		factorId = f && getCetasika(f) ? f : null;
		let restored = new Set<string>();
		const row = cittaId ? getCitta(cittaId) : undefined;
		if (row)
			for (const id of (params.get('o') ?? '').split(',')) {
				// Unknown or non-optional ids are ignored; the toggle rules apply as if each were switched on in turn.
				if (id && getCetasika(id) && !restored.has(id)) restored = toggleOptional(row, restored, id).on;
			}
		on = restored;
		lastEffect = null;
		highlight = [];
		shownRule = null;
	}

	function canonicalUrl() {
		const params = new URLSearchParams();
		if (reckoning === 121) params.set('r', '121');
		params.set('c', cittaId ?? '');
		if (on.size) params.set('o', [...on].join(','));
		if (factorId) params.set('f', factorId);
		const hash = cittaId === DEFAULT && reckoning === 89 && !on.size && !factorId ? '' : params.toString();
		return `${window.location.pathname}${window.location.search}${hash ? `#${hash}` : ''}`;
	}
	const currentUrl = () => `${window.location.pathname}${window.location.search}${window.location.hash}`;
	// A shallow replace through the router, so every history entry carries the router's metadata and
	// Back from another page restores this one (an entry made by a typed hash has none).
	function writeUrl(url: string) {
		goto(url, { shallow: true, replace: true, state: untrack(() => page.state) }).catch(() => {});
	}

	function onhashchange() {
		readHash();
		const meta = (history.state as Record<string, unknown> | null)?.['sveltekit:metadata'];
		if (!meta && canonicalUrl() === currentUrl()) writeUrl(currentUrl());
	}

	// The router has started once the first navigation completes; only then may the page write the URL.
	afterNavigate(() => {
		if (ready) return;
		readHash();
		ready = true;
	});

	$effect(() => {
		if (!ready) return;
		const url = canonicalUrl();
		if (url !== currentUrl()) writeUrl(url);
	});

	const vicara = { 89: reachOf(89, 'vicara').total, 121: reachOf(121, 'vicara').total };
	const piti = { 89: reachOf(89, 'piti').total, 121: reachOf(121, 'piti').total };
</script>

<svelte:head>
	<title>Combinations · Abhidhamma</title>
	<meta
		name="description"
		content="Choose a citta and see which of the 52 cetasikas it always has, may have, or never has, with the sheets' exclusivity rules."
	/>
</svelte:head>

<svelte:window {onkeydown} {onhashchange} />

<div class="page combos">
	<p class="visually-hidden" aria-live="polite">{announce}</p>

	<div class="layout" bind:this={layoutEl}>
		<header class="head">
			<p class="eyebrow">Citta × cetasika</p>
			<h1>What a moment is made of</h1>
			<p class="lede">Choose a mind-moment and watch which of the 52 factors it always has, may have, or never has.</p>
		</header>
		<div class="composer-col">
			<div class="reckon">
				<div class="filters" role="group" aria-label="Reckoning">
					<button type="button" aria-pressed={reckoning === 89} onclick={() => setReckoning(89)}>89 cittas</button>
					<button type="button" aria-pressed={reckoning === 121} onclick={() => setReckoning(121)}>121 cittas</button>
				</div>
				<p class="hint">121 counts the 8 supramundane cittas as 40, one per jhāna.</p>
			</div>
			<Composer {reckoning} {cittaId} onselect={selectCitta} />
		</div>
		<div class="wheel-col" bind:this={wheelEl}>
			<Wheel {citta} {on} {factorId} {highlight} {centre} oninspect={inspect} />
		</div>
		<div class="reading-col" bind:this={readingEl}>
			<Reading
				{citta}
				{reckoning}
				{on}
				{lastEffect}
				{factorId}
				ontoggle={toggle}
				onback={backToMoment}
				oninspect={inspect}
			/>
			<p class="share">
				<button type="button" onclick={copyLink}>{copied ? 'Link copied' : 'Copy link to this moment'}</button>
			</p>
		</div>
	</div>

	<div class="wrap lower">
		<Matrix {reckoning} {cittaId} {factorId} onselect={(id) => selectCitta(id)} onreveal={reveal} />

		<RuleCards shown={shownRule} {factorId} onshow={showRule} />

		<details class="notes">
			<summary>Notes on reckoning</summary>
			<ul>
				<li>
					The 121 reckoning changes one thing: it counts the 8 supramundane cittas as 40, one for each of the five
					jhānas. Everything else is the same.
				</li>
				<li>
					The sheet's figures for <span lang="pi">vicāra</span> ({vicara[121]}) and <span lang="pi">pīti</span>
					({piti[121]}) are counted on 121; <span lang="pi">vitakka</span> (55) is the same on both. On 89 this
					explorer derives {vicara[89]} and {piti[89]} (derived); the sheet gives no 89 figure.
				</li>
				<li>
					The “sixty-two” cittas with <span lang="pi">somanassa</span> is a 121 figure. On 89 this explorer derives
					{somanassaCount[89]} (derived) by counting the 8 supramundane cittas as first-jhāna (joyful), as the sampayoga sheet
					does for its totals. The sheets print no 89 figure.
				</li>
				<li>
					The wheel's arc labels follow the rows of the sampayoga sheet's "Factor by Factor" tables; the
					unwholesome sub-arcs are named by the cittas their factors arise in.
				</li>
				<li>A citta's total is the number of factors that can be found in it, not the number in every moment of it.</li>
				<li>
					Derived: the "at most N in a single moment" figure applies the one-at-a-time rules to the sheet's total. Where a
					citta can hold both an abstinence and an illimitable, the sheets don't say whether the two can share a moment.
				</li>
				<li>
					Inferred: whether an occasional factor is fixed or optional in a given citta (the sheet names only 11
					unfixed factors), and the feeling of the supramundane cittas on 89.
				</li>
				<li>
					The composer's questions and the "Notably absent" notes are arrangements of the citta data and the stated
					rules; where an attribute is not in the data, the reading says the sheets don't specify it.
				</li>
			</ul>
		</details>

		<p class="aid">
			The sheets are the source. This explorer arranges their counts and rules; it adds no counts or rules of its own.
			Figures marked derived are computed from the sheet data.
		</p>
	</div>
</div>

<style>
	.combos {
		overflow-x: clip;
	}
	.head h1 {
		margin: 0.15rem 0 0;
		font-size: clamp(1.9rem, 3vw, 2.5rem);
		line-height: 1.1;
	}
	.head .lede {
		margin: 0.5rem 0 0;
		font-size: 1.05rem;
		color: var(--muted);
	}
	.layout {
		width: min(1480px, calc(100% - 2rem));
		margin: 0 auto;
		display: grid;
		gap: 1.6rem;
		grid-template-columns: minmax(0, 1fr);
		grid-template-areas:
			'head'
			'composer'
			'wheel'
			'reading';
	}
	.head {
		grid-area: head;
	}
	.composer-col {
		grid-area: composer;
	}
	.wheel-col {
		grid-area: wheel;
		scroll-margin-top: 5rem;
	}
	.reading-col {
		grid-area: reading;
		scroll-margin-top: 5rem;
	}
	.layout {
		scroll-margin-top: 4.5rem;
	}
	.share {
		margin: 1rem 0 0;
	}
	.share button {
		padding: 0.2rem 0.75rem;
		font-size: 0.82rem;
		color: var(--muted);
	}
	.reckon {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.3rem 0.8rem;
		margin-bottom: 0.8rem;
	}
	.reckon .hint {
		margin: 0;
		font-size: 0.82rem;
		color: var(--muted);
	}
	.filters {
		display: flex;
		gap: 0.3rem;
	}
	.filters button {
		padding: 0.25rem 0.7rem;
		font-size: 0.86rem;
	}
	.filters button[aria-pressed='true'] {
		background: var(--ink);
		color: var(--bg-raised);
		box-shadow: none;
	}
	@media (min-width: 1000px) {
		.layout {
			/* The wheel is the page: it fills its column up to the viewport height; the text rides beside it. */
			--wheel-size: min(calc((100vh - 8.5rem) * 1.08), 960px);
			grid-template-columns: minmax(0, 1fr) clamp(300px, 28vw, 400px);
			grid-template-rows: auto auto 1fr;
			grid-template-areas:
				'wheel head'
				'wheel composer'
				'wheel reading';
			column-gap: 2.6rem;
			row-gap: 1.4rem;
		}
		.wheel-col {
			align-self: start;
			position: sticky;
			top: 5rem;
		}
	}
	.lower {
		display: grid;
		gap: 2.4rem;
		margin-top: 2.6rem;
	}
	.notes {
		border-top: 1px solid var(--line);
		padding-top: 1rem;
	}
	.notes summary {
		cursor: pointer;
		font-weight: 600;
	}
	.notes ul {
		color: var(--muted);
		max-width: var(--measure);
		font-size: 0.92rem;
	}
	.aid {
		margin: 0;
		color: var(--muted);
		font-size: 0.92rem;
		font-style: italic;
		font-family: var(--serif);
	}
</style>

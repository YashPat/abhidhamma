<script lang="ts" module>
	import { getCetasika } from '#lib/cetasikas';
	import { factorOrder } from '#lib/citta-data';
	import { wheelArcs, type WheelArc } from '#lib/combinations';
	import type { GroupId } from '#lib/types';

	// Geometry, in viewBox units. Factor labels are 16 units so they render at 14px or more when the
	// wheel is drawn at 700px or wider. The box is cropped to where the labels reach: the long
	// beautiful names push the right edge out further than the left, and the top labels are short.
	const BOX = { x: -342, y: -332, w: 744, h: 688 };
	const R_CENTER = 70;
	const R_INNER = 104;
	const R_MIDDLE = 160;
	const R_OUTER = 248;
	const R_ARC_TOP = 220;
	const R_ARC_BOTTOM = 230;
	const R_OUTER_LABEL = 262;
	const STEP = 7; // degrees between neighbours inside a sub-arc
	const CHAR = 7.4; // rough width of one 14-unit character

	type Spot = { id: string; group: GroupId; x: number; y: number; angle: number; ring: 'inner' | 'middle' | 'outer' };
	type ArcLabel = { id: string; text: string; path: string };

	const rad = (deg: number) => ((deg - 90) * Math.PI) / 180;
	const at = (r: number, deg: number) => ({ x: r * Math.cos(rad(deg)), y: r * Math.sin(rad(deg)) });
	const spanDeg = (text: string, r: number) => ((text.length * CHAR) / (2 * Math.PI * r)) * 360;

	function arcPath(r: number, from: number, to: number) {
		const a = at(r, from);
		const b = at(r, to);
		const sweep = to > from ? 1 : 0;
		const large = Math.abs(to - from) > 180 ? 1 : 0;
		return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} A ${r} ${r} 0 ${large} ${sweep} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
	}

	/** Lay one side out: sub-arcs along `dir`, with the gap before each arc wide enough for its label. */
	function layoutSide(arcs: WheelArc[], centre: number, dir: 1 | -1) {
		const offsets: number[][] = [];
		let pos = 0;
		arcs.forEach((arc, i) => {
			if (i > 0) {
				const prev = arcs[i - 1];
				const prevHalf = spanDeg(`${prev.label} ${prev.factors.length}`, R_ARC_TOP) / 2;
				const half = spanDeg(`${arc.label} ${arc.factors.length}`, R_ARC_TOP) / 2;
				const prevTail = ((prev.factors.length - 1) * STEP) / 2;
				const head = ((arc.factors.length - 1) * STEP) / 2;
				pos += Math.max(STEP * 1.6, prevHalf + half + 2.5 - prevTail - head);
			}
			offsets.push(arc.factors.map((_, j) => pos + j * STEP));
			pos = offsets[i][offsets[i].length - 1];
		});
		const start = centre - (dir * pos) / 2;
		return offsets.map((o) => o.map((d) => start + dir * d));
	}

	const spots: Spot[] = [];
	factorOrder.slice(0, 7).forEach((id, i) => {
		const angle = (i * 360) / 7;
		spots.push({ id, group: 'universal', angle, ring: 'inner', ...at(R_INNER, angle) });
	});
	factorOrder.slice(7, 13).forEach((id, i) => {
		const angle = 30 + i * 60;
		spots.push({ id, group: 'occasional', angle, ring: 'middle', ...at(R_MIDDLE, angle) });
	});
	const arcLabels: ArcLabel[] = [];
	for (const [side, centre, dir] of [
		['beautiful', 90, 1],
		['unwholesome', 270, -1]
	] as const) {
		const arcs = wheelArcs.filter((a) => a.side === side);
		const angles = layoutSide(arcs, centre, dir);
		arcs.forEach((arc, i) => {
			arc.factors.forEach((id, j) => {
				const angle = angles[i][j];
				spots.push({ id, group: getCetasika(id)?.group ?? side, angle, ring: 'outer', ...at(R_OUTER, angle) });
			});
			const mid = (angles[i][0] + angles[i][angles[i].length - 1]) / 2;
			const text = `${arc.label} ${arc.factors.length}`;
			const bottom = ((mid % 360) + 360) % 360 > 90 && ((mid % 360) + 360) % 360 < 270;
			const r = bottom ? R_ARC_BOTTOM : R_ARC_TOP;
			const half = spanDeg(text, r) / 2 + 4;
			// Bottom labels run counter-clockwise so they read upright.
			const path = bottom ? arcPath(r, mid + half, mid - half) : arcPath(r, mid - half, mid + half);
			arcLabels.push({ id: arc.id, text, path });
		});
	}
</script>

<script lang="ts">
	import { MediaQuery } from 'svelte/reactivity';
	import type { CittaRow, FactorState } from '#lib/types';
	import { factorsIn, stateOf } from '#lib/combinations';
	import { rovingIndex } from './roving';

	type Props = {
		citta: CittaRow | undefined;
		on: Set<string>;
		factorId: string | null;
		highlight: string[];
		centre: string;
		oninspect: (id: string) => void;
	};
	let { citta, on, factorId, highlight, centre, oninspect }: Props = $props();

	const stateWord: Record<FactorState, string> = { F: 'fixed', O: 'may arise', '-': 'not here' };
	const glyph: Record<FactorState, string> = { F: '●', O: '◌', '-': '·' };

	type DotState = 'F' | 'O' | 'on' | 'none' | 'idle';
	function dotState(id: string): DotState {
		if (!citta) return 'idle';
		const s = stateOf(citta, id);
		if (s === 'F') return 'F';
		if (s === 'O') return on.has(id) ? 'on' : 'O';
		return 'none';
	}
	function describe(id: string) {
		if (!citta) return 'no moment chosen';
		const s = stateOf(citta, id);
		if (s === 'O') return on.has(id) ? 'may arise; included in this moment' : 'may arise';
		return stateWord[s];
	}

	const fixedCount = $derived(citta ? factorsIn(citta, 'F').length : 0);
	const optionalIds = $derived(citta ? factorsIn(citta, 'O') : []);
	const includedCount = $derived(optionalIds.filter((id) => on.has(id)).length);

	// Below 640px the labels move into a list, so the wheel can drop their margin.
	const compact = new MediaQuery('max-width: 640px');
	const C = R_OUTER + 18;
	const box = $derived(compact.current ? { x: -C, y: -C, w: 2 * C, h: 2 * C } : BOX);

	// Roving tab stop: the wheel is one Tab stop; arrow keys walk the factors in sheet order.
	let rover = $derived<string>(factorId ?? factorOrder[0]);
	let svgEl: SVGSVGElement | undefined = $state();

	let tip = $state<string | null>(null);
	const tipSpot = $derived(tip ? spots.find((s) => s.id === tip) : undefined);
	const fracX = (v: number) => (v - box.x) / box.w;
	const pctX = (v: number) => `${fracX(v) * 100}%`;
	const pctY = (v: number) => `${((v - box.y) / box.h) * 100}%`;

	function onkey(event: KeyboardEvent, id: string) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			oninspect(id);
			return;
		}
		if (event.key === 'Escape' && tip) {
			// First Esc dismisses the tooltip; the next one reaches the page.
			event.stopPropagation();
			tip = null;
			return;
		}
		const next = rovingIndex(event.key, factorOrder.indexOf(id as (typeof factorOrder)[number]), factorOrder.length);
		if (next < 0) return;
		event.preventDefault();
		rover = factorOrder[next];
		svgEl?.querySelector<SVGElement>(`g.dot[data-id="${rover}"]`)?.focus();
	}

	function anchorFor(s: Spot): { x: number; y: number; anchor: 'start' | 'middle' | 'end'; rotate: number } {
		// Inner-ring labels on the upper half move outward, clear of the hub text: beside their dot,
		// or above it at the top.
		if (s.ring === 'inner' && s.y < -1) {
			if (Math.abs(s.x) < 20) return { x: s.x, y: s.y - 19, anchor: 'middle', rotate: 0 };
			return { x: s.x + Math.sign(s.x) * 17, y: s.y + 5, anchor: s.x < 0 ? 'end' : 'start', rotate: 0 };
		}
		if (s.ring !== 'outer') return { x: s.x, y: s.y + 30, anchor: 'middle', rotate: 0 };
		const p = at(R_OUTER_LABEL, s.angle);
		const a = ((s.angle % 360) + 360) % 360;
		return a < 180
			? { x: p.x, y: p.y, anchor: 'start', rotate: s.angle - 90 }
			: { x: p.x, y: p.y, anchor: 'end', rotate: s.angle + 90 };
	}

	const listGroups: { label: string; ids: string[] }[] = [
		{ label: 'Inner ring · universals 7', ids: factorOrder.slice(0, 7) },
		{ label: 'Middle ring · occasionals 6', ids: factorOrder.slice(7, 13) },
		...wheelArcs.map((a) => ({ label: `${a.side === 'unwholesome' ? 'Unwholesome' : 'Beautiful'} · ${a.label} ${a.factors.length}`, ids: a.factors }))
	];
</script>

<figure class="wheel" aria-label="The 52 cetasikas as a wheel">
	<div class="stage">
		<svg bind:this={svgEl} viewBox="{box.x} {box.y} {box.w} {box.h}" role="group" aria-label="Wheel of the 52 factors. Inner ring: 7 universals. Middle ring: 6 occasionals. Outer ring: 14 unwholesome on the left, 25 beautiful on the right.">
			<defs>
				{#each arcLabels as a (a.id)}
					<path id="arc-{a.id}" d={a.path} />
				{/each}
			</defs>
			<circle class="ring-line" r={R_INNER} />
			<circle class="ring-line" r={R_MIDDLE} />
			<circle class="ring-line" r={R_OUTER} />
			<circle class="hub" r={R_CENTER} />
			<g class="hub-text" aria-hidden="true">
				{#if citta}
					<text y="-26" class="hub-name">{centre}</text>
					<!-- The number counts the solid dots: fixed, plus any optional the reader included. -->
					<text y="16" class="hub-num">{fixedCount + includedCount}</text>
					<text y="36">{includedCount ? 'in this moment' : 'fixed'}</text>
					<text y="54">+{optionalIds.length - includedCount} may arise</text>
				{:else}
					<text y="-4">Choose</text>
					<text y="16">a moment</text>
				{/if}
			</g>
			{#each arcLabels as a (a.id)}
				<text class="arc-label" aria-hidden="true"><textPath href="#arc-{a.id}" startOffset="50%" text-anchor="middle">{a.text}</textPath></text>
			{/each}
			{#each spots as s (s.id)}
				{@const st = dotState(s.id)}
				{@const f = getCetasika(s.id)}
				{@const l = anchorFor(s)}
				<g
					class={['dot', { inspected: factorId === s.id, lit: highlight.includes(s.id) }]}
					data-id={s.id}
					data-group={s.group}
					data-state={st}
					role="button"
					tabindex={rover === s.id ? 0 : -1}
					aria-pressed={factorId === s.id}
					aria-label="{f?.pali}, {f?.gloss}: {describe(s.id)}"
					onclick={() => oninspect(s.id)}
					onkeydown={(e) => onkey(e, s.id)}
					onfocus={() => {
						rover = s.id;
						tip = s.id;
					}}
					onblur={() => (tip = null)}
					onpointerenter={(e) => {
						if (e.pointerType === 'mouse') tip = s.id;
					}}
					onpointerleave={(e) => {
						if (e.pointerType === 'mouse') tip = null;
					}}
				>
					<circle class="hit" cx={s.x} cy={s.y} r="17" />
					<circle class="focus-ring" cx={s.x} cy={s.y} r="20" />
					<circle class="halo" cx={s.x} cy={s.y} r="16" />
					<circle class="mark" cx={s.x} cy={s.y} r="10.5" />
					<text
						class="label"
						x={l.x}
						y={l.y}
						text-anchor={l.anchor}
						dominant-baseline={s.ring === 'outer' ? 'central' : 'auto'}
						transform={l.rotate ? `rotate(${l.rotate} ${l.x} ${l.y})` : undefined}>{f?.pali}</text
					>
				</g>
			{/each}
		</svg>
		{#if tipSpot}
			{@const f = getCetasika(tipSpot.id)}
			<!-- Shift the tip by the dot's place across the wheel, so edge tips stay inside it rather than off the page. -->
			<div class="tip" style:left={pctX(tipSpot.x)} style:top={pctY(tipSpot.y)} style:--shift="{-fracX(tipSpot.x) * 100}%" aria-hidden="true">
				<strong lang="pi">{f?.pali}</strong>
				<span>{f?.gloss}</span>
				<em>{describe(tipSpot.id)}</em>
			</div>
		{/if}
	</div>
	<details class="factor-list">
		<summary>The 52 factors as a list</summary>
		{#each listGroups as g (g.label)}
			<p class="fl-head">{g.label}</p>
			<ul>
				{#each g.ids as id (id)}
					{@const st = citta ? stateOf(citta, id) : null}
					<li>
						<button
							type="button"
							aria-pressed={factorId === id}
							data-state={st}
							aria-label="{getCetasika(id)?.pali}, {getCetasika(id)?.gloss}: {describe(id)}"
							onclick={() => oninspect(id)}
						>
							{#if st}<span class="glyph" aria-hidden="true">{st === 'O' && on.has(id) ? '●' : glyph[st]}</span>{/if}<span lang="pi">{getCetasika(id)?.pali}</span>
						</button>
					</li>
				{/each}
			</ul>
		{/each}
	</details>
	<figcaption>
		<ul class="legend">
			<li><svg viewBox="-12 -12 24 24" aria-hidden="true"><circle r="8" class="lg-fixed" /></svg> Fixed: always here</li>
			<li><svg viewBox="-12 -12 24 24" aria-hidden="true"><circle r="8" class="lg-may" /></svg> May arise (<span lang="pi">aniyata</span>): optional here</li>
			<li><svg viewBox="-12 -12 24 24" aria-hidden="true"><circle r="8" class="lg-may lg-on" /></svg> Included in this moment</li>
			<li><svg viewBox="-12 -12 24 24" aria-hidden="true"><circle r="3" class="lg-none" /></svg> Not in this citta</li>
		</ul>
	</figcaption>
</figure>

<style>
	.wheel {
		margin: 0;
	}
	.stage {
		position: relative;
		width: 100%;
		/* The page sets --wheel-size so the wheel can fill its column on wide screens. */
		max-width: var(--wheel-size, 620px);
		margin-inline: auto;
	}
	svg {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
		font-family: var(--sans);
	}
	.ring-line {
		fill: none;
		stroke: var(--line);
		stroke-width: 1.25;
	}
	.hub {
		fill: var(--bg-raised);
		stroke: var(--line);
	}
	.hub-text text {
		text-anchor: middle;
		font-size: 15px;
		fill: var(--muted);
	}
	.hub-text .hub-name {
		fill: var(--ink);
		font-family: var(--serif);
		font-style: italic;
		font-size: 16px;
	}
	.hub-text .hub-num {
		font-size: 40px;
		font-weight: 700;
		fill: var(--ink);
	}
	.arc-label {
		font-size: 14px;
		fill: var(--muted);
		letter-spacing: 0.03em;
	}
	.dot {
		cursor: pointer;
		outline: none;
		--c: var(--ink);
	}
	.dot[data-group='universal'] {
		--c: var(--universal);
	}
	.dot[data-group='occasional'] {
		--c: var(--occasional);
	}
	.dot[data-group='unwholesome'] {
		--c: var(--unwholesome);
	}
	.dot[data-group='beautiful'] {
		--c: var(--beautiful);
	}
	.hit {
		fill: transparent;
	}
	.mark,
	.halo {
		transition:
			transform 250ms ease,
			opacity 250ms ease,
			fill 250ms ease,
			stroke 250ms ease;
		transform-box: fill-box;
		transform-origin: center;
	}
	.label {
		transition:
			opacity 250ms ease,
			fill 250ms ease;
	}
	.mark {
		fill: var(--bg-raised);
		stroke: var(--muted);
		stroke-width: 1.5;
	}
	.dot[data-state='F'] .mark {
		fill: var(--c);
		stroke: var(--c);
	}
	.dot[data-state='O'] .mark {
		fill: var(--bg-raised);
		stroke: var(--c);
		stroke-width: 2.5;
		stroke-dasharray: 4 3;
	}
	.dot[data-state='on'] .mark {
		fill: var(--c);
		stroke: var(--c);
		stroke-width: 2.5;
		stroke-dasharray: 4 3;
		transform: scale(1.15);
	}
	.dot[data-state='none'] .mark {
		fill: var(--muted);
		stroke: none;
		transform: scale(0.34);
	}
	.label {
		font-size: 16px;
		fill: var(--ink);
	}
	/* Not-here labels: muted colour at full opacity (contrast), told apart from may-arise by colour and
	   from fixed/included by weight; the mark's shape carries the state too. */
	.dot[data-state='none'] .label {
		fill: var(--muted);
	}
	.dot[data-state='F'] .label,
	.dot[data-state='on'] .label {
		font-weight: 600;
	}
	.halo {
		fill: none;
		stroke: var(--accent);
		stroke-width: 2.5;
		opacity: 0;
		transform: scale(0.8);
	}
	.dot.lit .halo,
	.dot.inspected .halo {
		opacity: 1;
		transform: scale(1);
	}
	/* Keyboard focus: a thin ink ring outside the accent halo, so focus and "inspected" read apart. */
	.focus-ring {
		fill: none;
		stroke: var(--ink);
		stroke-width: 2;
		opacity: 0;
	}
	.dot:focus-visible .focus-ring {
		opacity: 1;
	}
	.dot.inspected .halo {
		stroke-width: 3.5;
	}
	.dot:hover .mark {
		stroke: var(--accent);
	}
	.tip {
		position: absolute;
		transform: translate(var(--shift, -50%), calc(-100% - 14px));
		background: var(--ink);
		color: var(--bg-raised);
		border-radius: 8px;
		padding: 0.4rem 0.6rem;
		font-size: 0.85rem;
		line-height: 1.3;
		display: grid;
		pointer-events: none;
		white-space: nowrap;
		z-index: 2;
	}
	.tip em {
		font-style: normal;
		opacity: 0.8;
	}
	figcaption {
		margin-top: 0.4rem;
	}
	.legend {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.3rem 1.4rem;
		list-style: none;
		margin: 0;
		padding: 0;
		font-size: 0.84rem;
		color: var(--muted);
	}
	.legend li {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
	}
	.legend svg {
		width: 14px;
		height: 14px;
	}
	.lg-fixed {
		fill: var(--ink);
	}
	.lg-may {
		fill: none;
		stroke: var(--ink);
		stroke-width: 2.5;
		stroke-dasharray: 4 3;
	}
	.lg-on {
		fill: var(--ink);
	}
	.lg-none {
		fill: var(--muted);
	}
	.factor-list {
		display: none;
	}
	.factor-list summary {
		cursor: pointer;
		font-weight: 600;
		margin-top: 0.8rem;
	}
	.fl-head {
		margin: 0.8rem 0 0.3rem;
		font-size: 0.82rem;
		color: var(--muted);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}
	.factor-list ul {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.factor-list button {
		padding: 0.25rem 0.6rem;
		font-size: 0.88rem;
	}
	.factor-list button[data-state='-'] {
		color: var(--muted);
	}
	.factor-list button[data-state='F'] {
		font-weight: 600;
	}
	.factor-list button[aria-pressed='true'] {
		box-shadow: inset 0 0 0 2px var(--accent);
	}
	.glyph {
		display: inline-block;
		width: 1em;
		margin-right: 0.2rem;
	}
	@media (max-width: 640px) {
		.label,
		.arc-label,
		.hub-text text:not(.hub-num) {
			display: none;
		}
		.hub-text .hub-num {
			font-size: 44px;
		}
		.mark {
			r: 12;
		}
		.factor-list {
			display: block;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.mark,
		.halo,
		.label {
			transition: none;
		}
	}
</style>

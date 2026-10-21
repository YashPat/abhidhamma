<script lang="ts">
	import { getCetasika } from '#lib/cetasikas';
	import { cittaSections, fullLabel, getCitta, groupCittas, reachOf, stateOf, type Reckoning } from '#lib/combinations';
	import type { CittaRow, FactorState } from '#lib/types';
	import { rovingIndex } from './roving';

	type Props = {
		reckoning: Reckoning;
		cittaId: string | null;
		factorId: string | null;
		onselect: (id: string) => void;
		/** Bring the wheel and reading into view: the matrix sits below them, so a pick here changes something off-screen. */
		onreveal: () => void;
	};
	let { reckoning, cittaId, factorId, onselect, onreveal }: Props = $props();

	const chosen = $derived(cittaId ? getCitta(cittaId) : undefined);
	// Offer the way back up only after a pick made here, not for a moment chosen above.
	let pickedHere = $state(false);

	const factor = $derived(factorId ? getCetasika(factorId) : undefined);
	const reach = $derived(factorId ? reachOf(reckoning, factorId) : null);
	const word: Record<FactorState, string> = { F: 'fixed', O: 'may arise', '-': 'never' };

	const ids = $derived(cittaSections.flatMap((sec) => sec.groups.flatMap((g) => groupCittas(reckoning, g.id).map((r) => r.id))));
	// Roving tab stop: one Tab into the grid, arrow keys within it.
	let active = $derived(cittaId && ids.includes(cittaId) ? cittaId : ids[0]);
	let grid: HTMLElement | undefined = $state();

	function onkeydown(event: KeyboardEvent) {
		const next = rovingIndex(event.key, ids.indexOf(active), ids.length);
		if (next < 0) return;
		event.preventDefault();
		active = ids[next];
		grid?.querySelector<HTMLButtonElement>(`button[data-id="${active}"]`)?.focus();
	}

	function cellLabel(row: CittaRow, groupLabel: string) {
		const s = factorId ? stateOf(row, factorId) : null;
		return `${groupLabel}: ${row.label}${s && factor ? `. ${factor.pali}: ${word[s]}` : ''}${cittaId === row.id ? ' (chosen)' : ''}`;
	}
</script>

<details class="matrix">
	<summary>
		<span class="sum-title">Browse all {reckoning} cittas</span>
		{#if factor}<span class="sum-sub">showing where <span lang="pi">{factor.pali}</span> arises</span>{/if}
	</summary>
	<div class="body">
		<p class="hint">On the {reckoning} reckoning; switch it beside the composer above.</p>
		{#if factor && reach}
			<p class="heat-key">
				<strong><span lang="pi">{factor.pali}</span>:</strong>
				<span class="k"><span class="cell sm" data-state="F" aria-hidden="true"></span> fixed in {reach.fixed}</span>
				<span class="k"><span class="cell sm" data-state="O" aria-hidden="true"></span> may arise in {reach.optional}</span>
				<span class="k"><span class="cell sm" data-state="-" aria-hidden="true"></span> never in {reckoning - reach.total}</span>
			</p>
		{:else}
			<p class="hint">Each square is one citta. Choose one to put it on the wheel; inspect a factor to turn this into its map.</p>
		{/if}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="sections" bind:this={grid} {onkeydown}>
			{#each cittaSections as section (section.id)}
				<section>
					<h3><span lang="pi">{section.pali}</span> · {section.label}</h3>
					{#each section.groups as group (group.id)}
						{@const rows = groupCittas(reckoning, group.id)}
						{#if rows.length}
							<div class="group">
								<p class="g-label">{group.label} <span class="n">{rows.length}</span></p>
								<ul>
									{#each rows as row (row.id)}
										{@const name = cellLabel(row, group.label)}
										<li>
											<button
												type="button"
												class="cell"
												data-id={row.id}
												data-state={factorId ? stateOf(row, factorId) : null}
												tabindex={active === row.id ? 0 : -1}
												aria-pressed={cittaId === row.id}
												aria-label={name}
												title={name}
												onfocus={() => (active = row.id)}
												onclick={() => {
													pickedHere = true;
													onselect(row.id);
												}}
											></button>
										</li>
									{/each}
								</ul>
							</div>
						{/if}
					{/each}
				</section>
			{/each}
		</div>
		{#if pickedHere && chosen}
			<p class="picked">
				On the wheel now: <strong>{fullLabel(chosen)}</strong>.
				<button type="button" class="link-button" onclick={onreveal}>See it on the wheel ↑</button>
			</p>
		{/if}
	</div>
</details>

<style>
	.matrix {
		border: 1px solid var(--line);
		border-radius: 14px;
		background: var(--bg-raised);
		padding: 0.9rem 1.2rem;
		margin: 0;
	}
	summary {
		cursor: pointer;
		display: flex;
		flex-wrap: wrap;
		gap: 0.2rem 0.8rem;
		align-items: baseline;
	}
	.sum-title {
		font-weight: 600;
	}
	.sum-sub {
		color: var(--muted);
		font-size: 0.9rem;
	}
	.hint,
	.heat-key {
		margin: 0.6rem 0 0;
		font-size: 0.88rem;
		color: var(--muted);
	}
	.heat-key {
		color: var(--ink);
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem 1rem;
		align-items: center;
	}
	.k {
		display: inline-flex;
		gap: 0.35rem;
		align-items: center;
	}
	.sections {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
		gap: 0.6rem 1.6rem;
		margin-top: 0.8rem;
	}
	h3 {
		font-size: 0.85rem;
		margin: 0.4rem 0 0.2rem;
	}
	.g-label {
		margin: 0.25rem 0 0.15rem;
		font-size: 0.8rem;
		color: var(--muted);
	}
	.n {
		opacity: 0.8;
	}
	ul {
		display: flex;
		flex-wrap: wrap;
		gap: 3px;
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.cell {
		display: inline-block;
		/* 24px: the WCAG 2.5.8 minimum target. */
		width: 24px;
		height: 24px;
		padding: 0;
		border-radius: 3px;
		background: var(--line);
		box-shadow: none;
		transition:
			background-color 250ms ease,
			transform 250ms ease;
	}
	/* An outline, so hover shows in the heat map too, where the fill carries the state. */
	.cell:hover {
		outline: 2px solid var(--muted);
		outline-offset: 1px;
	}
	.cell[data-state='F'] {
		background: var(--ink);
	}
	.cell[data-state='O'] {
		background: var(--bg-raised);
		box-shadow: none;
		border: 2px dashed var(--ink);
	}
	.cell[data-state='-'] {
		background: radial-gradient(circle, var(--muted) 0 2.5px, transparent 3px);
	}
	/* The chosen cell gets a ring (box-shadow), leaving the outline free for hover and keyboard focus. */
	.cell[aria-pressed='true'] {
		box-shadow:
			0 0 0 2px var(--bg-raised),
			0 0 0 4px var(--accent);
	}
	.cell:focus-visible {
		outline: 2px solid var(--ink);
		outline-offset: 4px;
	}
	.picked {
		margin: 0.9rem 0 0;
		font-size: 0.88rem;
	}
	.link-button {
		padding: 0;
		margin-left: 0.3rem;
		background: none;
		box-shadow: none;
		color: var(--accent);
		text-decoration: underline;
		font-weight: 600;
	}
	.cell.sm {
		width: 14px;
		height: 14px;
	}
	@media (prefers-reduced-motion: reduce) {
		.cell {
			transition: none;
		}
	}
</style>

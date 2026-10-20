<script lang="ts">
	import { confusionMatches, confusions } from '#lib/confusions';
	import { togetherMeta } from '#lib/labels';
	import type { Together } from '#lib/types';

	let query = $state('');
	let together = $state<'all' | Together>('all');

	const shown = $derived(
		confusions.filter(
			(confusion) =>
				(together === 'all' || confusion.together === together) && confusionMatches(confusion, query)
		)
	);

	const filters: { id: 'all' | Together; label: string }[] = [
		{ id: 'all', label: 'All' },
		{ id: 'exclusive', label: togetherMeta.exclusive.label },
		{ id: 'partial', label: togetherMeta.partial.label },
		{ id: 'jobs', label: togetherMeta.jobs.label }
	];
</script>

<svelte:head>
	<title>Mix-ups · Abhidhamma</title>
</svelte:head>

<div class="wrap page">
	<p class="eyebrow">Telling factors apart</p>
	<h1>The ones that get mixed up</h1>
	<p class="lede">
		Each page says whether the factors can share a moment, and on what basis: a definition in the sheets, a
		combination rule, the split between citta classes, or a difference in what they do. A class split is
		general. It is not a special fact about that pair.
	</p>

	<div class="toolbar">
		<label class="search">
			<span class="visually-hidden">Search mix-ups</span>
			<input bind:value={query} type="search" placeholder="Try shame, equanimity, envy, mindfulness" />
		</label>
		<div class="filters" role="group" aria-label="Filter by how they combine">
			{#each filters as filter (filter.id)}
				<button type="button" aria-pressed={together === filter.id} onclick={() => (together = filter.id)}>
					{filter.label}
				</button>
			{/each}
		</div>
	</div>

	<p class="result-count">{shown.length} {shown.length === 1 ? 'mix-up' : 'mix-ups'}</p>

	{#if shown.length === 0}
		<p>Nothing matches. Try shame, equanimity, or mindfulness.</p>
	{/if}

	<ul class="mixup-list">
		{#each shown as confusion (confusion.id)}
			<li>
				<a href="/confused/{confusion.id}">
					<span class="badge" data-together={confusion.together}>{togetherMeta[confusion.together].label}</span>
					<strong>{confusion.title}</strong>
					<span>{confusion.lede}</span>
				</a>
			</li>
		{/each}
	</ul>
</div>

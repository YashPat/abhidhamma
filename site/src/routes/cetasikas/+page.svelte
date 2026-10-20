<script lang="ts">
	import { cetasikas, groupOrder } from '#lib/cetasikas';
	import { confusionMatches, confusions } from '#lib/confusions';
	import { groupMeta } from '#lib/labels';
	import type { Cetasika, GroupId } from '#lib/types';

	let query = $state('');
	let group = $state<'all' | GroupId>('all');

	function matches(factor: Cetasika, raw: string): boolean {
		const words = raw.trim().toLowerCase().split(/\s+/).filter(Boolean);
		if (words.length === 0) return true;
		const hay = [
			factor.pali,
			factor.gloss,
			factor.id,
			factor.range,
			factor.example.scene,
			factor.example.read,
			factor.misread ?? '',
			...(factor.aliases ?? [])
		]
			.join('\n')
			.toLowerCase();
		return words.every((word) => hay.includes(word));
	}

	const shown = $derived(
		cetasikas.filter((factor) => (group === 'all' || factor.group === group) && matches(factor, query))
	);
	const related = $derived(query.trim().length < 3 ? [] : confusions.filter((item) => confusionMatches(item, query)));
	const filters = [{ id: 'all' as const, label: 'All 52' }, ...groupOrder.map((id) => ({ id, label: groupMeta[id].label }))];
</script>

<svelte:head>
	<title>Cetasikas · Abhidhamma</title>
</svelte:head>

<div class="wrap page">
	<p class="eyebrow">52 factors</p>
	<h1 lang="pi">Cetasikas</h1>
	<p class="lede">
		Mental factors, in the traditional order from the cetasika sheet. Open the first and use Next to read
		straight through, or search for the plain word you already have.
	</p>
	<p><a class="button" href="/cetasikas/phassa">Read in order</a></p>

	<div class="toolbar">
		<label class="search">
			<span class="visually-hidden">Search factors</span>
			<input bind:value={query} type="search" placeholder="Try greed, mindfulness, doubt, equanimity" />
		</label>
		<div class="filters" role="group" aria-label="Filter by group">
			{#each filters as filter (filter.id)}
				<button type="button" aria-pressed={group === filter.id} onclick={() => (group = filter.id)}>
					{filter.label}
				</button>
			{/each}
		</div>
	</div>

	{#if related.length > 0}
		<aside class="related-strip">
			<p>Mix-ups that match</p>
			<ul>
				{#each related as confusion (confusion.id)}
					<li><a href="/confused/{confusion.id}">{confusion.title}</a></li>
				{/each}
			</ul>
		</aside>
	{/if}

	<p class="result-count">{shown.length} {shown.length === 1 ? 'factor' : 'factors'}</p>

	{#if shown.length === 0}
		<p>No factor matches. Try a plain word such as greed, mindfulness, or doubt.</p>
	{/if}

	{#each groupOrder as groupId (groupId)}
		{@const items = shown.filter((factor) => factor.group === groupId)}
		{#if items.length > 0}
			<section class="group-block">
				<header>
					<h2>{groupMeta[groupId].label}</h2>
					<p>{groupMeta[groupId].blurb}</p>
				</header>
				<ul class="factor-grid">
					{#each items as factor (factor.id)}
						<li>
							<a class="factor-card" href="/cetasikas/{factor.id}" data-group={factor.group}>
								<span class="pill" data-group={factor.group}>{groupMeta[factor.group].label}</span>
								<span class="factor-name" lang="pi">{factor.pali}</span>
								<span class="factor-gloss">{factor.gloss}</span>
								<span class="hint-line">{factor.syllables.map((syllable) => syllable.hint).join(' · ')}</span>
							</a>
						</li>
					{/each}
				</ul>
			</section>
		{/if}
	{/each}
</div>

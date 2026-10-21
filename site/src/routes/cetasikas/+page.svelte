<script lang="ts">
	import { resolve } from '$app/paths';
	import { cetasikas, groupOrder } from '#lib/cetasikas';
	import { confusionMatches, confusions } from '#lib/confusions';
	import { groupMeta } from '#lib/labels';
	import { matchesWords, queryWords } from '#lib/search';
	import type { Cetasika, GroupId } from '#lib/types';
	import { replaceState } from '$app/navigation';
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	let query = $state('');
	let group = $state<'all' | GroupId>('all');

	function isGroup(value: string | null): value is GroupId {
		return value !== null && (groupOrder as string[]).includes(value);
	}

	// The page is prerendered, so the search and group live in the URL only after
	// hydration. Reading them here lets a filtered list be bookmarked or shared.
	onMount(() => {
		const params = new URLSearchParams(location.search);
		query = params.get('q') ?? '';
		const fromUrl = params.get('group');
		if (isGroup(fromUrl)) group = fromUrl;
	});

	function syncUrl() {
		const url = new URL(location.href);
		if (query.trim()) url.searchParams.set('q', query.trim());
		else url.searchParams.delete('q');
		if (group === 'all') url.searchParams.delete('group');
		else url.searchParams.set('group', group);
		replaceState(url, page.state);
	}

	function setGroup(id: 'all' | GroupId) {
		group = id;
		syncUrl();
	}

	function clearFilters() {
		query = '';
		group = 'all';
		syncUrl();
	}

	function matches(factor: Cetasika, words: string[]): boolean {
		const hay = [
			factor.pali,
			factor.gloss,
			factor.id,
			factor.range,
			factor.example.scene,
			factor.example.read,
			factor.misread ?? '',
			...(factor.aliases ?? [])
		].join('\n');
		return matchesWords(hay, words);
	}

	const words = $derived(queryWords(query));
	const shown = $derived(
		cetasikas.filter((factor) => (group === 'all' || factor.group === group) && matches(factor, words))
	);
	const filtered = $derived(words.length > 0 || group !== 'all');
	const related = $derived(query.trim().length < 3 ? [] : confusions.filter((item) => confusionMatches(item, query)));
	const filters = [{ id: 'all' as const, label: 'All 52' }, ...groupOrder.map((id) => ({ id, label: groupMeta[id].label }))];
</script>

<svelte:head>
	<title>Cetasikas · Abhidhamma</title>
	<meta
		name="description"
		content="The 52 mental factors in sheet order, each with its pronunciation, a moment that shows it, and where it arises."
	/>
</svelte:head>

<div class="wrap page">
	<p class="eyebrow">52 factors</p>
	<h1 lang="pi">Cetasikas</h1>
	<p class="lede">
		Mental factors, in the traditional order from the cetasika sheet. Open the first and use Next to read
		straight through, or search for the plain word you already have.
	</p>
	<p><a class="button" href={resolve('/cetasikas/[slug]', { slug: 'phassa' })}>Read in order</a></p>

	<div class="toolbar">
		<label class="search">
			<span class="visually-hidden">Search factors</span>
			<input bind:value={query} oninput={syncUrl} type="search" placeholder="Try greed, mindfulness, doubt, equanimity" />
		</label>
		<div class="filters" role="group" aria-label="Filter by group">
			{#each filters as filter (filter.id)}
				<button type="button" aria-pressed={group === filter.id} onclick={() => setGroup(filter.id)}>
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
					<li><a href={resolve('/confused/[id]', { id: confusion.id })}>{confusion.title}</a></li>
				{/each}
			</ul>
		</aside>
	{/if}

	<p class="result-count">
		<span aria-live="polite">
			{shown.length} {shown.length === 1 ? 'factor' : 'factors'}{group === 'all' ? '' : ` in ${groupMeta[group].label}`}
		</span>
		{#if filtered}
			<button type="button" class="button-quiet clear" onclick={clearFilters}>Show all 52</button>
		{/if}
	</p>

	{#if shown.length === 0}
		<p>
			No factor matches{group === 'all' ? '' : ' in this group'}. Try a plain word such as greed, mindfulness,
			or doubt. Pāli works with or without the accents.
		</p>
	{/if}

	{#each groupOrder as groupId (groupId)}
		{@const items = shown.filter((factor) => factor.group === groupId)}
		{#if items.length > 0}
			<section class="group-block" id={groupId}>
				<header>
					<h2>{groupMeta[groupId].label}</h2>
					<p>{groupMeta[groupId].blurb}</p>
				</header>
				<ul class="factor-grid">
					{#each items as factor (factor.id)}
						<li>
							<a class="factor-card" href={resolve('/cetasikas/[slug]', { slug: factor.id })} data-group={factor.group}>
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

<style>
	.clear {
		margin-left: 0.5rem;
		padding: 0.15rem 0.6rem;
		font-size: 0.85rem;
	}
</style>

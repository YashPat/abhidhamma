<script lang="ts">
	import Key from '#lib/components/Key.svelte';
	import Pronounce from '#lib/components/Pronounce.svelte';
	import { cetasikas, groupOrder } from '#lib/cetasikas';
	import { groupMeta } from '#lib/labels';
	import { matchesWords, queryWords } from '#lib/search';
	import { terms } from '#lib/terms';

	let query = $state('');

	const words = $derived(queryWords(query));
	const factorHits = $derived(
		cetasikas.filter((factor) => matchesWords(`${factor.pali} ${factor.gloss} ${factor.id}`, words))
	);
	const termHits = $derived(terms.filter((term) => matchesWords(`${term.pali} ${term.gloss}`, words)));
	const hitCount = $derived(factorHits.length + termHits.length);
</script>

<svelte:head>
	<title>Pronounce · Abhidhamma</title>
	<meta
		name="description"
		content="How to say the Pāli names in the Abhidhamma sheets: a letter key, then syllables, stress, and phonetics for every factor and term."
	/>
</svelte:head>

<div class="wrap page">
	<p class="eyebrow">Saying the names</p>
	<h1>Pronunciation</h1>
	<p class="lede">
		The reference sheets do not record pronunciation. This is a guide to the romanization they use. Lived
		traditions shift some of the sounds. The syllable line is the one to learn. The voice button is an
		English approximation.
	</p>

	<Key />

	<label class="search pronounce-search">
		<span class="visually-hidden">Search names</span>
		<input bind:value={query} type="search" placeholder="Search a name or a gloss" />
	</label>
	{#if words.length > 0}
		<p class="result-count" aria-live="polite">{hitCount} {hitCount === 1 ? 'name' : 'names'}</p>
	{/if}

	{#if hitCount === 0}
		<p>Nothing matches. Try citta, contact, or mindfulness. Accents are optional.</p>
	{/if}

	{#each groupOrder as groupId (groupId)}
		{@const items = factorHits.filter((factor) => factor.group === groupId)}
		{#if items.length > 0}
			<section>
				<h2>{groupMeta[groupId].label}</h2>
				<ul class="pronounce-list">
					{#each items as factor (factor.id)}
						<li>
							<a href="/cetasikas/{factor.id}">
								<span lang="pi">{factor.pali}</span>
								<span>{factor.gloss}</span>
							</a>
							<Pronounce
								name={factor.pali}
								syllables={factor.syllables}
								stress={factor.stress}
								ipa={factor.ipa}
								trap={factor.trap}
							/>
						</li>
					{/each}
				</ul>
			</section>
		{/if}
	{/each}

	{#if termHits.length > 0}
		<section>
			<h2>Other names the sheets use</h2>
			<ul class="pronounce-list">
				{#each termHits as term (term.id)}
					<li>
						<div class="term-heading">
							<span lang="pi">{term.pali}</span>
							<span>{term.gloss}</span>
							<span class="caption">{term.where}</span>
						</div>
						<Pronounce
							name={term.pali}
							syllables={term.syllables}
							stress={term.stress}
							ipa={term.ipa}
							trap={term.trap}
						/>
					</li>
				{/each}
			</ul>
		</section>
	{/if}
</div>

<style>
	.pronounce-search {
		display: block;
		margin-top: 1.5rem;
	}
</style>

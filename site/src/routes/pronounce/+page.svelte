<script lang="ts">
	import Key from '#lib/components/Key.svelte';
	import Pronounce from '#lib/components/Pronounce.svelte';
	import { cetasikas, groupOrder } from '#lib/cetasikas';
	import { groupMeta } from '#lib/labels';
	import { terms } from '#lib/terms';

	let query = $state('');

	function hit(text: string): boolean {
		const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
		if (words.length === 0) return true;
		return words.every((word) => text.toLowerCase().includes(word));
	}

	const factorHitCount = $derived(
		cetasikas.filter((factor) => hit(`${factor.pali} ${factor.gloss} ${factor.id}`)).length
	);
	const termHits = $derived(terms.filter((term) => hit(`${term.pali} ${term.gloss}`)));
</script>

<svelte:head>
	<title>Pronounce · Abhidhamma</title>
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

	{#if factorHitCount === 0 && termHits.length === 0}
		<p>Nothing matches. Try citta, contact, or mindfulness.</p>
	{/if}

	{#each groupOrder as groupId (groupId)}
		{@const items = cetasikas.filter(
			(factor) => factor.group === groupId && hit(`${factor.pali} ${factor.gloss} ${factor.id}`)
		)}
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

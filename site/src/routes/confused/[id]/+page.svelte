<script lang="ts">
	import Drill from '#lib/components/Drill.svelte';
	import { confusions } from '#lib/confusions';
	import { getCetasika } from '#lib/cetasikas';
	import { noteKindLabel, togetherMeta } from '#lib/labels';

	let { data } = $props();
	const confusion = $derived(data.confusion);
	const index = $derived(confusions.findIndex((item) => item.id === confusion.id));
	const prev = $derived(index > 0 ? confusions[index - 1] : undefined);
	const next = $derived(index >= 0 ? confusions[index + 1] : undefined);

	function factorName(id: string): string {
		const factor = getCetasika(id);
		return factor ? `${factor.pali} — ${factor.gloss}` : id;
	}
</script>

<svelte:head>
	<title>{confusion.title} · Abhidhamma</title>
</svelte:head>

<div class="wrap page">
	<p class="crumbs">
		<a href="/confused">Mix-ups</a>
		<span aria-hidden="true">/</span>
		<span>{confusion.title}</span>
	</p>
	<p class="badge" data-together={confusion.together}>{togetherMeta[confusion.together].label}</p>
	<h1>{confusion.title}</h1>
	<p class="lede">{confusion.lede}</p>
	<p>{togetherMeta[confusion.together].hint}</p>

	<section class="panel">
		<h2>Can they share a moment?</h2>
		<p>{confusion.togetherText}</p>
	</section>

	{#if confusion.quote}
		<figure class="sheet-quote">
			<blockquote>
				<p>{confusion.quote.text}</p>
			</blockquote>
			<figcaption>{confusion.quote.source}</figcaption>
		</figure>
	{/if}

	<section class="notes">
		{#each confusion.notes as note, noteIndex (noteIndex)}
			<article>
				<p class="eyebrow">{noteKindLabel[note.kind]}</p>
				<p>{note.text}</p>
				<p class="caption">{note.source}</p>
			</article>
		{/each}
	</section>

	<section>
		<h2>How to tell them</h2>
		<ul class="tell-list">
			{#each confusion.members as member (member.id)}
				<li>
					<a href="/cetasikas/{member.id}">
						<span lang="pi">{factorName(member.id)}</span>
					</a>
					<p>{member.tell}</p>
				</li>
			{/each}
		</ul>
	</section>

	{#key confusion.id}
		<Drill {confusion} />
	{/key}

	<nav class="pager" aria-label="Mix-ups">
		{#if prev}
			<a href="/confused/{prev.id}">
				<span>Previous</span>
				<strong>{prev.title}</strong>
			</a>
		{:else}
			<span></span>
		{/if}
		{#if next}
			<a class="next" href="/confused/{next.id}">
				<span>Next</span>
				<strong>{next.title}</strong>
			</a>
		{/if}
	</nav>
</div>

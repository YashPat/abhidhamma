<script lang="ts">
	import Pronounce from '#lib/components/Pronounce.svelte';
	import { confusionsFor } from '#lib/confusions';
	import { neighbors, positionInGroup } from '#lib/cetasikas';
	import { groupMeta, togetherMeta } from '#lib/labels';

	let { data } = $props();
	const factor = $derived(data.factor);
	const related = $derived(confusionsFor(factor.id));
	const nearby = $derived(neighbors(factor.id));
	const place = $derived(positionInGroup(factor));
</script>

<svelte:head>
	<title>{factor.pali} · Abhidhamma</title>
	<meta name="description" content="{factor.pali}: {factor.gloss}. How to say it, a moment that shows it, and where it arises." />
</svelte:head>

<div class="wrap page factor-page">
	<p class="crumbs">
		<a href="/cetasikas">Cetasikas</a>
		<span aria-hidden="true">/</span>
		<a href="/cetasikas?group={factor.group}">{groupMeta[factor.group].label}</a>
	</p>
	<p class="pill" data-group={factor.group}>
		{groupMeta[factor.group].label} · {place.index} of {place.total}
	</p>
	<h1 lang="pi">{factor.pali}</h1>
	<p class="lede">{factor.gloss}</p>

	{#key factor.id}
		<Pronounce
			name={factor.pali}
			syllables={factor.syllables}
			stress={factor.stress}
			ipa={factor.ipa}
			trap={factor.trap}
		/>
	{/key}
	<p class="key-link"><a href="/pronounce#key">How to read this pronunciation</a></p>

	<section class="moment">
		<h2>A moment that shows it</h2>
		<blockquote>
			<p>{factor.example.scene}</p>
		</blockquote>
		<p>{factor.example.read}</p>
		<p class="caption">
			The cetasika sheet defines the factor. This scene is a reading aid written to match that definition.
			It is not in the sheets.
		</p>
	</section>

	{#if factor.misread}
		<section class="panel">
			<h2>Easy to mishear</h2>
			<p>{factor.misread}</p>
		</section>
	{/if}

	<section>
		<h2>Where it arises</h2>
		<p>{factor.range}</p>
		<p class="caption">From the sampayoga sheet, on the eighty-nine-citta scheme unless the line says otherwise.</p>
	</section>

	<section class="sheet-excerpt">
		<h2>From the cetasika sheet</h2>
		<div class="excerpt">
			{@html data.section.html}
		</div>
		<p>
			<a href="/sheets/cetasikas#{data.section.id}">Read this section in the full sheet</a>
		</p>
	</section>

	{#if related.length > 0}
		<section>
			<h2>Often mixed up with</h2>
			<ul class="mixup-list">
				{#each related as confusion (confusion.id)}
					<li>
						<a href="/confused/{confusion.id}">
							<span class="badge" data-together={confusion.together}>{togetherMeta[confusion.together].label}</span>
							<strong>{confusion.title}</strong>
							<span>{confusion.lede}</span>
						</a>
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	<nav class="pager" aria-label="Factors in order">
		{#if nearby.prev}
			<a href="/cetasikas/{nearby.prev.id}">
				<span>Previous</span>
				<strong lang="pi">{nearby.prev.pali}</strong>
			</a>
		{:else}
			<span></span>
		{/if}
		{#if nearby.next}
			<a class="next" href="/cetasikas/{nearby.next.id}">
				<span>Next</span>
				<strong lang="pi">{nearby.next.pali}</strong>
			</a>
		{/if}
	</nav>
</div>

<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>The sheets · Abhidhamma</title>
	<meta
		name="description"
		content="The four Abhidhamma reference sheets, citta, cetasika, sampayoga, and vīthi, rendered for reading with their wording and counts unchanged."
	/>
</svelte:head>

<div class="wrap page">
	<p class="eyebrow">Source text</p>
	<h1>The reference sheets</h1>
	<p class="lede">
		These four pages are the sheets, rendered for reading. Wording, counts, and rules are unchanged. Study
		aids live on the factor, mix-up, and pronunciation pages, and they are marked as aids.
	</p>
	<div class="cards two">
		{#each data.sheets as sheet (sheet.slug)}
			<a class="info-card" href="/sheets/{sheet.slug}">
				<p class="eyebrow">{sheet.question}</p>
				<h2 lang="pi">{sheet.title}</h2>
				<p>{sheet.summary}</p>
			</a>
		{/each}
	</div>
</div>

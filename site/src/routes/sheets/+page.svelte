<script lang="ts">
	const sheets = [
		{
			href: '/sheets/citta',
			title: 'Citta',
			question: 'What kind of mind-moment is this?',
			text: 'Plane, nature, association, and prompting. Eighty-nine cittas, or one hundred twenty-one.'
		},
		{
			href: '/sheets/cetasikas',
			title: 'Cetasika',
			question: 'What is this moment made of?',
			text: 'The fifty-two factors, defined one by one. For pronunciation and examples, use the factor pages.'
		},
		{
			href: '/sheets/sampayoga',
			title: 'Sampayoga',
			question: 'What can share a moment?',
			text: 'Ranges, compositions, and the exclusivity rules. This is the sheet the mix-up pages cite.'
		},
		{
			href: '/sheets/vithi',
			title: 'Vīthi',
			question: 'When, in the sequence, did this happen?',
			text: 'Sense door, mind door, absorption, and death. Determining settles the javanas.'
		}
	];
</script>

<svelte:head>
	<title>The sheets · Abhidhamma</title>
</svelte:head>

<div class="wrap page">
	<p class="eyebrow">Source text</p>
	<h1>The reference sheets</h1>
	<p class="lede">
		These four pages are the sheets, rendered for reading. Wording, counts, and rules are unchanged. Study
		aids live on the factor, mix-up, and pronunciation pages, and they are marked as aids.
	</p>
	<div class="cards two">
		{#each sheets as sheet (sheet.href)}
			<a class="info-card" href={sheet.href}>
				<p class="eyebrow">{sheet.question}</p>
				<h2 lang="pi">{sheet.title}</h2>
				<p>{sheet.text}</p>
			</a>
		{/each}
	</div>
</div>

<script lang="ts">
	import { resolve } from '$app/paths';
	import { cetasikas } from '#lib/cetasikas';
	import { confusions, getConfusion } from '#lib/confusions';

	const universals = cetasikas.filter((factor) => factor.group === 'universal');
	const featuredIds = [
		'shame-and-fear',
		'attention-perception-mindfulness',
		'feeling-and-rapture',
		'intention-wish-greed',
		'neutral-and-equanimity',
		'six-pairs'
	];
	const featured = featuredIds.map((id) => {
		const confusion = getConfusion(id);
		if (!confusion) throw new Error(`Missing featured mix-up ${id}`);
		return confusion;
	});

	const sheets = [
		{
			href: resolve('/sheets/[slug]', { slug: 'citta' }),
			title: 'Citta',
			question: 'What kind of mind-moment?',
			text: '89 consciousnesses, or 121 if the eight supramundane ones are counted at each of the five jhānas.'
		},
		{
			href: resolve('/sheets/[slug]', { slug: 'cetasikas' }),
			title: 'Cetasika',
			question: 'What is it made of?',
			text: '52 factors. The study pages add pronunciation, a moment, and the lookalikes. The sheet page is the sheet.'
		},
		{
			href: resolve('/sheets/[slug]', { slug: 'sampayoga' }),
			title: 'Sampayoga',
			question: 'What can share it?',
			text: 'Which factors yoke together, and which never do. Most of the distinctions live here.'
		},
		{
			href: resolve('/sheets/[slug]', { slug: 'vithi' }),
			title: 'Vīthi',
			question: 'When did it happen?',
			text: 'The sequence. Kamma is made in the javanas. Their character is settled at determining.'
		}
	];
</script>

<svelte:head>
	<title>Abhidhamma</title>
	<meta
		name="description"
		content="A readable Theravāda Abhidhamma: the reference sheets, how to say each cetasika, and how to tell the lookalikes apart."
	/>
</svelte:head>

<div class="wrap page">
	<section class="hero">
		<p class="eyebrow">Theravāda Abhidhamma</p>
		<h1>Learn the mind-moment by reading it, saying it, and telling the lookalikes apart.</h1>
		<p class="lede">
			Four reference sheets, shown as written. Fifty-two mental factors, each with a pronunciation and a
			real moment. And the pairs that are easy to mix up, separated the way the sheets separate them.
		</p>
		<div class="hero-actions">
			<a class="button" href={resolve('/cetasikas')}>Start with the factors</a>
			<a class="button button-quiet" href={resolve('/confused')}>I keep mixing them up</a>
		</div>
	</section>

	<section class="panel">
		<h2>One moment is one event</h2>
		<p>
			A citta never arises alone. The factors below are the minimum of a knowing. They arise together and
			they cease together. Contact does not happen first.
		</p>
		<ul class="assembly">
			{#each universals as factor (factor.id)}
				<li>
					<a href={resolve('/cetasikas/[slug]', { slug: factor.id })}>
						<span lang="pi">{factor.pali}</span>
						<span>{factor.gloss}</span>
					</a>
				</li>
			{/each}
		</ul>
		<p class="caption">Seven universals, in all 89 cittas. From the sampayoga sheet.</p>
	</section>

	<section>
		<h2>These compositions do not blend</h2>
		<div class="cards three">
			<a class="info-card" href="{resolve('/sheets/[slug]', { slug: 'sampayoga' })}#2-ahetuka-citta-rootless">
				<p class="eyebrow">Bare seeing</p>
				<p>The ten sense consciousnesses have the seven factors and nothing else. Recognition and reaction come later in the process.</p>
			</a>
			<a class="info-card" href="{resolve('/sheets/[slug]', { slug: 'sampayoga' })}#3-akusala-the-fourteen-unwholesome">
				<p class="eyebrow">Unwholesome</p>
				<p>All twelve of these cittas include delusion, shamelessness, moral fearlessness, and restlessness. Greed and hatred never share one.</p>
			</a>
			<a class="info-card" href="{resolve('/sheets/[slug]', { slug: 'sampayoga' })}#4-sobhana-the-twenty-five-beautiful">
				<p class="eyebrow">Beautiful</p>
				<p>All fifty-nine include nineteen factors, mindfulness among them. There is no wholesome moment without it.</p>
			</a>
		</div>
		<p class="caption">
			Unwholesome and beautiful factors do not overlap because their cittas do not. That is a class split.
			It is true of every pair across that line, not a special rivalry between two factors.
		</p>
		<p><a href={resolve('/combinations')}>Pick a citta and see which factors it always has, may have, or never has</a></p>
	</section>

	<section class="panel">
		<h2>Where a reaction gets its character</h2>
		<p>
			In a full sense-door process, determining is the last inert moment. It settles the kammic character
			of the javanas that follow. The mind door has no separate determining moment: adverting does that
			work in the same citta that turns the mind.
		</p>
		<p><a href="{resolve('/sheets/[slug]', { slug: 'vithi' })}#8-votthapana-determining">Read determining in the vīthi sheet</a></p>
	</section>

	<section>
		<h2>The sheets</h2>
		<div class="cards two">
			{#each sheets as sheet (sheet.href)}
				<a class="info-card" href={sheet.href}>
					<p class="eyebrow">{sheet.question}</p>
					<h3 lang="pi">{sheet.title}</h3>
					<p>{sheet.text}</p>
				</a>
			{/each}
		</div>
	</section>

	<section>
		<h2>Mix-ups that catch almost everyone</h2>
		<div class="cards two">
			{#each featured as confusion (confusion.id)}
				<a class="info-card" href={resolve('/confused/[id]', { id: confusion.id })}>
					<h3>{confusion.title}</h3>
					<p>{confusion.lede}</p>
				</a>
			{/each}
		</div>
		<p><a href={resolve('/confused')}>All {confusions.length} mix-ups</a></p>
	</section>

	<section class="panel">
		<h2>Say the names</h2>
		<p>
			The romanization is regular. <span lang="pi">ph</span> is not f, <span lang="pi">th</span> is not the
			th in “think,” and <span lang="pi">c</span> is ch. A doubled letter is held.
		</p>
		<p><a class="button button-quiet" href={resolve('/pronounce')}>Open the pronunciation guide</a></p>
	</section>
</div>

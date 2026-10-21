<script lang="ts">
	import { page } from '$app/state';

	const missing = $derived(page.status === 404);

	const places = [
		{ href: '/cetasikas', label: 'The 52 factors' },
		{ href: '/combinations', label: 'Combinations' },
		{ href: '/confused', label: 'Mix-ups' },
		{ href: '/pronounce', label: 'Pronunciation' },
		{ href: '/sheets', label: 'The four sheets' }
	];
</script>

<svelte:head>
	<title>{missing ? 'Page not found' : page.status} · Abhidhamma</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="wrap page">
	<p class="eyebrow">{missing ? 'Missing page' : 'Something went wrong'}</p>
	<h1>{page.status}</h1>
	<p class="lede">
		{#if missing}
			There is no page at <code>{page.url.pathname}</code>. A factor or mix-up may have a different
			name here than the one you tried.
		{:else}
			{page.error?.message ?? 'The page could not be shown.'}
		{/if}
	</p>
	<p><a class="button" href="/">Back to the start</a></p>
	<h2>Or go straight to</h2>
	<ul>
		{#each places as place (place.href)}
			<li><a href={place.href}>{place.label}</a></li>
		{/each}
	</ul>
</div>

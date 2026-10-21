<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	const missing = $derived(page.status === 404);

	const places = [
		{ href: resolve('/cetasikas'), label: 'The 52 factors' },
		{ href: resolve('/combinations'), label: 'Combinations' },
		{ href: resolve('/confused'), label: 'Mix-ups' },
		{ href: resolve('/pronounce'), label: 'Pronunciation' },
		{ href: resolve('/sheets'), label: 'The four sheets' }
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
	<p><a class="button" href={resolve('/')}>Back to the start</a></p>
	<h2>Or go straight to</h2>
	<ul>
		{#each places as place (place.href)}
			<li><a href={place.href}>{place.label}</a></li>
		{/each}
	</ul>
</div>

<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>{page.status} · Abhidhamma</title>
</svelte:head>

<div class="wrap page">
	<p class="eyebrow">{page.status === 404 ? 'Missing page' : 'Something went wrong'}</p>
	<h1>{page.status}</h1>
	<p class="lede">{page.error?.message ?? 'That page is not in the study.'}</p>
	<p><a class="button" href="/">Back to the start</a></p>
</div>

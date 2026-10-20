<script lang="ts">
	let { data } = $props();
	const sheet = $derived(data.sheet);
</script>

<svelte:head>
	<title>{sheet.title} · Abhidhamma</title>
</svelte:head>

<div class="wrap page sheet-page">
	<p class="crumbs">
		<a href="/sheets">The sheets</a>
		<span aria-hidden="true">/</span>
		<span lang="pi">{sheet.title}</span>
	</p>
	<p class="lede sheet-lede">{sheet.lede}</p>
	<div class="sheet-layout">
		<nav class="toc" aria-label="On this sheet">
			{#each sheet.toc as item (item.id)}
				<a class="toc-{item.level}" href="#{item.id}">{item.text}</a>
			{/each}
		</nav>
		<article class="sheet">
			{@html sheet.html}
		</article>
	</div>
</div>

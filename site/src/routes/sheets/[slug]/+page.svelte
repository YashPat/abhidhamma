<script lang="ts">
	import type { Attachment } from 'svelte/attachments';

	let { data } = $props();
	const sheet = $derived(data.sheet);

	let activeId = $state('');
	let copied = $state('');
	let scrollY = $state(0);
	let copiedTimer: ReturnType<typeof setTimeout> | undefined;

	// Highlight the section being read: the last h2/h3 whose top has passed under the sticky nav.
	// Takes the slug so the attachment re-runs when client navigation swaps the sheet.
	function trackSections(article: HTMLElement, _slug: string) {
		const headings = [...article.querySelectorAll<HTMLElement>('h2[id], h3[id]')];
		let frame = 0;
		function update() {
			frame = 0;
			let current = '';
			for (const heading of headings) {
				if (heading.getBoundingClientRect().top > 120) break;
				current = heading.id;
			}
			activeId = current;
		}
		function schedule() {
			if (!frame) frame = requestAnimationFrame(update);
		}
		update();
		window.addEventListener('scroll', schedule, { passive: true });
		window.addEventListener('resize', schedule, { passive: true });
		return () => {
			window.removeEventListener('scroll', schedule);
			window.removeEventListener('resize', schedule);
			if (frame) cancelAnimationFrame(frame);
		};
	}

	// Keep the active entry visible inside the scrolling contents list, without moving the page.
	function revealActive(toc: HTMLElement) {
		const link = activeId ? toc.querySelector<HTMLElement>(`[data-id="${activeId}"]`) : null;
		if (!link) return;
		const top = link.offsetTop - toc.offsetTop;
		if (top < toc.scrollTop || top + link.offsetHeight > toc.scrollTop + toc.clientHeight) {
			toc.scrollTop = top - toc.clientHeight / 2;
		}
	}

	const followActive: Attachment<HTMLElement> = (toc) => {
		revealActive(toc);
	};

	// The "#" after each heading still navigates; it also copies the section link.
	function onArticleClick(event: MouseEvent) {
		const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>('a.heading-anchor');
		if (!anchor || !navigator.clipboard) return;
		const id = anchor.hash.slice(1);
		navigator.clipboard.writeText(anchor.href).then(
			() => {
				copied = id;
				clearTimeout(copiedTimer);
				copiedTimer = setTimeout(() => (copied = ''), 2000);
			},
			() => {}
		);
	}
</script>

<svelte:head>
	<title>{sheet.title} · Abhidhamma</title>
	<meta name="description" content="{sheet.title} sheet: {sheet.question} {sheet.summary}" />
</svelte:head>

<svelte:window bind:scrollY />

<div class="wrap page sheet-page" id="sheet-top">
	<p class="crumbs">
		<a href="/sheets">The sheets</a>
		<span aria-hidden="true">/</span>
		<span lang="pi">{sheet.title}</span>
	</p>
	<p class="lede sheet-lede">{sheet.lede}</p>
	<div class="sheet-layout">
		<nav class="toc" aria-label="On this sheet" {@attach followActive}>
			{#each sheet.toc as item (item.id)}
				<a
					class={[`toc-${item.level}`, { active: activeId === item.id }]}
					href="#{item.id}"
					data-id={item.id}
					aria-current={activeId === item.id ? 'location' : undefined}>{item.text}</a
				>
			{/each}
		</nav>
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
		<article class="sheet" onclick={onArticleClick} {@attach (article) => trackSections(article, sheet.slug)}>
			{@html sheet.html}
		</article>
	</div>

	<nav class="pager" aria-label="Sheets">
		{#if data.prev}
			<a href="/sheets/{data.prev.slug}">
				<span>Previous sheet</span>
				<strong lang="pi">{data.prev.title}</strong>
			</a>
		{:else}
			<span></span>
		{/if}
		{#if data.next}
			<a class="next" href="/sheets/{data.next.slug}">
				<span>Next sheet</span>
				<strong lang="pi">{data.next.title}</strong>
			</a>
		{/if}
	</nav>

	<p class="visually-hidden" aria-live="polite">{copied ? 'Link to section copied' : ''}</p>
	{#if copied}
		<p class="copied-toast" aria-hidden="true">Link copied</p>
	{/if}

	<a class="to-top" class:shown={scrollY > 900} href="#sheet-top">
		<span aria-hidden="true">↑</span> Top
	</a>
</div>

<style>
	.sheet-page :global(:is(h1, h2, h3)[id]) {
		scroll-margin-top: 5.2rem;
		/* Long Pāli compounds would otherwise push the page wider than a phone. */
		overflow-wrap: break-word;
	}

	.sheet-page :global(.heading-anchor) {
		margin-left: 0.35em;
		padding: 0 0.15em;
		color: var(--muted);
		text-decoration: none;
		font-weight: 500;
		opacity: 0;
		transition: opacity 0.15s;
	}

	.sheet-page :global(:is(h2, h3):hover .heading-anchor),
	.sheet-page :global(.heading-anchor:focus-visible) {
		opacity: 1;
	}

	@media (hover: none) {
		.sheet-page :global(.heading-anchor) {
			opacity: 0.55;
		}
	}

	.sheet-page :global(.heading-anchor:hover) {
		color: var(--accent);
	}

	.sheet-page :global(.table-wrap:focus-visible) {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.toc a.active {
		color: var(--ink);
		font-weight: 600;
		box-shadow: inset 2px 0 0 var(--accent);
		padding-left: 0.5rem;
	}

	.toc a.toc-3.active {
		padding-left: 1.3rem;
	}

	@media (max-width: 860px) {
		.toc a.active {
			padding-left: 0.7rem;
		}

		.toc a.toc-3.active {
			padding-left: 1.35rem;
		}
	}

	.pager {
		margin-top: 3rem;
	}

	.copied-toast,
	.to-top {
		position: fixed;
		bottom: 1.2rem;
		z-index: 5;
		padding: 0.45rem 0.8rem;
		border: 1px solid var(--line);
		border-radius: 999px;
		background: var(--bg-raised);
		color: var(--ink);
		font-size: 0.9rem;
		box-shadow: var(--shadow);
	}

	.copied-toast {
		left: 50%;
		translate: -50% 0;
		margin: 0;
	}

	.to-top {
		right: 1.2rem;
		text-decoration: none;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.2s;
	}

	.to-top.shown,
	.to-top:focus-visible {
		opacity: 1;
		pointer-events: auto;
	}

	@media (prefers-reduced-motion: reduce) {
		.to-top,
		.sheet-page :global(.heading-anchor) {
			transition: none;
		}
	}

	@media print {
		.to-top,
		.copied-toast,
		.sheet-page :global(.heading-anchor) {
			display: none;
		}
	}
</style>

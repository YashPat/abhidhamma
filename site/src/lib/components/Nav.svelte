<script lang="ts">
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';

	let open = $state(false);
	let header: HTMLElement;
	let toggle: HTMLButtonElement;

	afterNavigate(() => {
		open = false;
	});

	const links = [
		{ href: '/cetasikas', label: 'Factors' },
		{ href: '/combinations', label: 'Combinations' },
		{ href: '/confused', label: 'Mix-ups' },
		{ href: '/pronounce', label: 'Pronounce' },
		{ href: '/sheets', label: 'The sheets' }
	];

	function current(href: string): boolean {
		const path = page.url.pathname;
		return path === href || path.startsWith(`${href}/`);
	}

	// The phone menu closes on Escape (focus goes back to its button) and on a tap outside the header.
	function onkeydown(event: KeyboardEvent) {
		if (open && event.key === 'Escape') {
			open = false;
			toggle.focus();
		}
	}

	function onclick(event: MouseEvent) {
		if (open && !header.contains(event.target as Node)) open = false;
	}
</script>

<svelte:window {onkeydown} />
<svelte:document {onclick} />

<a class="skip" href="#content">Skip to content</a>
<header class="nav" bind:this={header}>
	<div class="wrap nav-bar">
		<a class="wordmark" href="/" aria-current={page.url.pathname === '/' ? 'page' : undefined}>
			<span class="wordmark-title">Abhidhamma</span>
			<span class="wordmark-sub">a mind-moment, taken apart</span>
		</a>
		<button
			class="nav-toggle"
			type="button"
			bind:this={toggle}
			aria-expanded={open}
			aria-controls="site-nav"
			onclick={() => (open = !open)}
		>
			{open ? 'Close' : 'Menu'}
		</button>
		<nav id="site-nav" aria-label="Site" class={['nav-links', { open }]}>
			{#each links as link (link.href)}
				<a href={link.href} aria-current={current(link.href) ? 'page' : undefined}>{link.label}</a>
			{/each}
		</nav>
	</div>
</header>

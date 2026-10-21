<script lang="ts">
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';

	let open = $state(false);

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
</script>

<a class="skip" href="#content">Skip to content</a>
<header class="nav">
	<div class="wrap nav-bar">
		<a class="wordmark" href="/" aria-current={page.url.pathname === '/' ? 'page' : undefined}>
			<span class="wordmark-title">Abhidhamma</span>
			<span class="wordmark-sub">a mind-moment, taken apart</span>
		</a>
		<button
			class="nav-toggle"
			type="button"
			aria-expanded={open}
			aria-controls="site-nav"
			onclick={() => (open = !open)}
		>
			{open ? 'Close' : 'Menu'}
		</button>
		<nav id="site-nav" class={['nav-links', { open }]}>
			{#each links as link (link.href)}
				<a href={link.href} aria-current={current(link.href) ? 'page' : undefined}>{link.label}</a>
			{/each}
		</nav>
	</div>
</header>

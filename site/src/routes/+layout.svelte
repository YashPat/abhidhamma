<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import Nav from '#lib/components/Nav.svelte';
	import { stopSpeaking } from '#lib/speak';
	import type { Snippet } from 'svelte';
	import '../app.css';

	let { children }: { children: Snippet } = $props();

	afterNavigate(() => stopSpeaking());
</script>

<Nav />
<main id="content">
	{@render children()}
</main>
<footer class="site-footer">
	<div class="wrap">
		<p>
			The four sheets are shown as written. Pronunciation is a guide to that romanization; the sheets do
			not record it. Each real moment is a reading aid written to match the sheet’s definition, and is
			not itself in the sheets. Counts and combination rules are.
		</p>
	</div>
</footer>

<script lang="ts">
	import { pali, rules, type Rule } from '#lib/combinations';

	type Props = { shown: string | null; factorId: string | null; onshow: (rule: Rule, factorId: string) => void };
	let { shown, factorId, onshow }: Props = $props();
	const enforced = rules.filter((r) => r.acts);
	const encoded = rules.filter((r) => !r.acts);
</script>

<section class="rules" aria-labelledby="rules-title">
	<h2 id="rules-title">The rules</h2>
	<p class="intro">
		The build toggles enforce {enforced.length} of these {rules.length}. The other {encoded.length} are already written
		into the citta data, so a citta that breaks them never offers the factors together.
	</p>
	<ul class="cards">
		{#each rules as rule (rule.id)}
			<li class={['card', { shown: shown === rule.id }]}>
				<h3>{rule.title}</h3>
				<p class="quote">“{rule.quote}”</p>
				<p class="scope">{rule.scope}</p>
				<p class="foot">
					<span class="tag">{rule.acts ? 'Enforced by the toggles' : 'Encoded in the data'}</span>
					<cite>{rule.source}</cite>
				</p>
				<p class="show">
					{#each rule.factors as id (id)}
						<button type="button" aria-pressed={shown === rule.id && factorId === id} onclick={() => onshow(rule, id)}>
							Show <span lang="pi">{pali(id)}</span>
						</button>
					{/each}
				</p>
			</li>
		{/each}
	</ul>
</section>

<style>
	.rules {
		margin: 0;
	}
	.intro {
		color: var(--muted);
		max-width: var(--measure);
	}
	.cards {
		list-style: none;
		margin: 1rem 0 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 19rem), 1fr));
		gap: 0.7rem;
	}
	.card {
		background: var(--bg-raised);
		border: 1px solid var(--line);
		border-radius: 12px;
		padding: 0.8rem 1rem;
		transition: border-color 250ms ease;
	}
	.card.shown {
		border-color: var(--accent);
	}
	h3 {
		margin: 0;
		font-size: 1rem;
	}
	.quote {
		margin: 0.35rem 0 0;
		font-family: var(--serif);
		font-style: italic;
	}
	.scope {
		margin: 0.35rem 0 0;
		font-size: 0.85rem;
		color: var(--muted);
	}
	.foot {
		margin: 0.45rem 0 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.2rem 0.7rem;
		font-size: 0.78rem;
		color: var(--muted);
	}
	.tag {
		font-weight: 600;
	}
	cite {
		font-style: normal;
	}
	.show {
		margin: 0.5rem 0 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
	}
	.show button {
		padding: 0.25rem 0.65rem;
		font-size: 0.85rem;
	}
	@media (prefers-reduced-motion: reduce) {
		.card {
			transition: none;
		}
	}
</style>

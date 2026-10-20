<script lang="ts">
	import { speak } from '#lib/speak';
	import type { Syllable } from '#lib/types';

	type Props = {
		name: string;
		syllables: Syllable[];
		stress: number[];
		ipa: string;
		trap?: string;
	};

	let { name, syllables, stress, ipa, trap }: Props = $props();
	let speechNote = $state('');

	function hear() {
		const text = syllables.map((syllable) => syllable.hint).join(', ');
		speechNote = '';
		const ok = speak(text, (status) => {
			speechNote =
				status === 'start'
					? 'Playing a rough English voice. Trust the syllables, not the voice.'
					: 'The voice did not start. The syllables above are the pronunciation.';
		});
		if (!ok) {
			speechNote = 'This browser has no speech voice. The syllables above are the pronunciation.';
		}
	}
</script>

<div class="pronounce">
	<div class="syllables">
		{#each syllables as syllable, index (syllable.text + index)}
			<span class={['syllable', { stressed: stress.includes(index) }]}>
				{#if stress.includes(index)}
					<span class="visually-hidden">Stressed.</span>
				{/if}
				<span class="syllable-pali" lang="pi">{syllable.text}</span>
				<span class="syllable-hint">{syllable.hint}</span>
			</span>
		{/each}
	</div>
	<p class="ipa"><span class="ipa-label">Phonetic</span> {ipa}</p>
	{#if trap}
		<p class="trap">{trap}</p>
	{/if}
	<div class="pronounce-actions">
		<button type="button" onclick={hear}>Hear <span lang="pi">{name}</span></button>
		<p class="speech-note" aria-live="polite">{speechNote}</p>
	</div>
	<p class="pronounce-caption">
		Syllables for <span lang="pi">{name}</span>. The darker syllable is stressed. The button uses an English voice and will be approximate.
	</p>
</div>

<script lang="ts">
	import { canSpeak, speak, stopSpeaking } from '#lib/speak';
	import type { Syllable } from '#lib/types';
	import { onMount } from 'svelte';

	type Props = {
		name: string;
		syllables: Syllable[];
		stress: number[];
		ipa: string;
		trap?: string;
	};

	let { name, syllables, stress, ipa, trap }: Props = $props();
	let speechNote = $state('');
	let playing = $state(false);
	// Assumed true for the prerendered HTML; checked once the page is live.
	let supported = $state(true);

	onMount(() => {
		supported = canSpeak();
	});

	function hear() {
		if (playing) {
			stopSpeaking();
			return;
		}
		const text = syllables.map((syllable) => syllable.hint).join(', ');
		speechNote = '';
		const ok = speak(text, (status) => {
			if (status === 'start') {
				speechNote = 'Playing a rough English voice. Trust the syllables, not the voice.';
				return;
			}
			playing = false;
			speechNote =
				status === 'error' ? 'The voice did not start. The syllables above are the pronunciation.' : '';
		});
		playing = ok;
		if (!ok) {
			supported = false;
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
		{#if supported}
			<button type="button" onclick={hear}>
				{#if playing}Stop<span class="visually-hidden"> <span lang="pi">{name}</span></span>{:else}Hear <span lang="pi">{name}</span>{/if}
			</button>
			<p class="speech-note" aria-live="polite">{speechNote}</p>
		{:else}
			<p class="speech-note">This browser has no speech voice. The syllables above are the pronunciation.</p>
		{/if}
	</div>
	<p class="pronounce-caption">
		Syllables for <span lang="pi">{name}</span>. The bold syllable is stressed. {#if supported}The button uses an English voice and will be approximate.{/if}
	</p>
</div>

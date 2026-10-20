let pendingTimer: number | undefined;
let generation = 0;

export function speak(text: string, onStatus?: (status: 'start' | 'error') => void): boolean {
	if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
	const synth = window.speechSynthesis;
	const mine = ++generation;
	window.clearTimeout(pendingTimer);
	pendingTimer = undefined;
	synth.cancel();
	const utterance = new SpeechSynthesisUtterance(text);
	utterance.lang = 'en-US';
	utterance.rate = 0.78;
	utterance.onstart = () => {
		if (mine === generation) onStatus?.('start');
	};
	utterance.onerror = () => {
		if (mine === generation) onStatus?.('error');
	};
	// Chrome drops an utterance spoken in the same turn as cancel(), so the
	// speak is deferred. The timer id is kept so a second click or a
	// navigation can drop it before it starts.
	pendingTimer = window.setTimeout(() => {
		if (mine !== generation) return;
		pendingTimer = undefined;
		synth.speak(utterance);
		if (synth.paused) synth.resume();
	}, 40);
	return true;
}

export function stopSpeaking(): void {
	if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
	generation += 1;
	window.clearTimeout(pendingTimer);
	pendingTimer = undefined;
	window.speechSynthesis.cancel();
}

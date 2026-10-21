export type SpeechStatus = 'start' | 'end' | 'error';

let pendingTimer: number | undefined;
let generation = 0;
// The caller whose utterance is queued or playing. It hears 'end' when a newer
// speak() or stopSpeaking() supersedes it, so its button can leave the playing state.
let activeListener: ((status: SpeechStatus) => void) | undefined;

export function canSpeak(): boolean {
	return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

function release(): void {
	const listener = activeListener;
	activeListener = undefined;
	listener?.('end');
}

export function speak(text: string, onStatus?: (status: SpeechStatus) => void): boolean {
	if (!canSpeak()) return false;
	const synth = window.speechSynthesis;
	const mine = ++generation;
	window.clearTimeout(pendingTimer);
	pendingTimer = undefined;
	release();
	synth.cancel();
	activeListener = onStatus;
	const utterance = new SpeechSynthesisUtterance(text);
	utterance.lang = 'en-US';
	utterance.rate = 0.78;
	// No voice is picked by name: macOS lists novelty voices under en-US, and
	// voices load asynchronously in Chrome. The lang tag lets the browser choose.
	utterance.onstart = () => {
		if (mine === generation) onStatus?.('start');
	};
	utterance.onend = () => {
		if (mine === generation) release();
	};
	utterance.onerror = (event) => {
		if (mine !== generation) return;
		activeListener = undefined;
		// A cancel() from our own stop reports as an error in some browsers; that is not a failure.
		onStatus?.(event.error === 'canceled' || event.error === 'interrupted' ? 'end' : 'error');
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
	if (!canSpeak()) return;
	generation += 1;
	window.clearTimeout(pendingTimer);
	pendingTimer = undefined;
	release();
	window.speechSynthesis.cancel();
}

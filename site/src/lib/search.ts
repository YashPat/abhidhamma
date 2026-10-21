// Lowercase and strip diacritics, so "metta" finds mettā and "sanna" finds saññā.
export function fold(text: string): string {
	return text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
}

export function queryWords(query: string): string[] {
	return fold(query).trim().split(/\s+/).filter(Boolean);
}

// True when every query word appears somewhere in the haystack. An empty query matches everything.
export function matchesWords(haystack: string, words: string[]): boolean {
	if (words.length === 0) return true;
	const hay = fold(haystack);
	return words.every((word) => hay.includes(word));
}

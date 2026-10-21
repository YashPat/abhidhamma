const STEP: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

/**
 * The index a roving-tab-stop key moves to from `i` in a list of `length` items: arrows step by one
 * (clamped at the ends), Home and End jump. Returns -1 for any other key, which the caller leaves alone.
 */
export function rovingIndex(key: string, i: number, length: number): number {
	const last = length - 1;
	if (key in STEP) return Math.min(last, Math.max(0, i + STEP[key]));
	if (key === 'Home') return 0;
	if (key === 'End') return last;
	return -1;
}

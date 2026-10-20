import type { GroupId, NoteKind, Together } from './types';

export const groupMeta: Record<
	GroupId,
	{ label: string; count: number; blurb: string }
> = {
	universal: {
		label: 'In every moment',
		count: 7,
		blurb:
			'Seven factors with no exception. The sampayoga sheet says remove any one of them and there is no knowing left.'
	},
	occasional: {
		label: 'In some moments',
		count: 6,
		blurb:
			'Six factors whose absence is information. Each one drops out for a reason in its own nature.'
	},
	unwholesome: {
		label: 'Unwholesome',
		count: 14,
		blurb:
			'Fourteen factors. Four of them — delusion, shamelessness, moral fearlessness, and restlessness — are in all twelve unwholesome cittas.'
	},
	beautiful: {
		label: 'Beautiful',
		count: 25,
		blurb:
			'Twenty-five factors. Nineteen of them are in every beautiful citta, which is why a beautiful moment always includes mindfulness.'
	}
};

export const togetherMeta: Record<Together, { label: string; hint: string }> = {
	jobs: {
		label: 'Not alternatives',
		hint: 'These are not a menu. The work is telling the jobs apart.'
	},
	exclusive: {
		label: 'Do not share a moment',
		hint: 'When one of the pair is present, the other is absent.'
	},
	partial: {
		label: 'Co-arising is uneven',
		hint: 'Some of this set can be present while others are missing.'
	}
};

export const noteKindLabel: Record<NoteKind, string> = {
	definition: 'Defined apart in the sheets',
	rule: 'A combination rule',
	class: 'Different citta classes',
	function: 'Opposed in what they do'
};

export type GroupId = 'universal' | 'occasional' | 'unwholesome' | 'beautiful';

export type Syllable = {
	text: string;
	hint: string;
};

export type Example = {
	scene: string;
	read: string;
};

export type Cetasika = {
	id: string;
	pali: string;
	gloss: string;
	group: GroupId;
	syllables: Syllable[];
	stress: number[];
	ipa: string;
	trap?: string;
	range: string;
	example: Example;
	misread?: string;
	aliases?: string[];
};

export type Together = 'jobs' | 'exclusive' | 'partial';

export type NoteKind = 'definition' | 'rule' | 'class' | 'function';

export type ConfusionNote = {
	kind: NoteKind;
	source: string;
	text: string;
};

export type ConfusionMember = {
	id: string;
	tell: string;
};

export type Confusion = {
	id: string;
	title: string;
	lede: string;
	together: Together;
	togetherText: string;
	notes: ConfusionNote[];
	members: ConfusionMember[];
	keywords: string[];
	quote?: { text: string; source: string };
	drillIds?: string[];
	drillNote?: string;
};

export type Term = {
	id: string;
	pali: string;
	gloss: string;
	where: string;
	syllables: Syllable[];
	stress: number[];
	ipa: string;
	trap?: string;
};

export type TocItem = {
	id: string;
	text: string;
	level: number;
};

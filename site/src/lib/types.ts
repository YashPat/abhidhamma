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

export type FactorState = 'F' | 'O' | '-';

/** One of the 52 cetasika ids, in the order of a CittaRow's `factors` string. */
export type FactorId = (typeof import('./citta-data.ts').factorOrder)[number];

export type CittaGroup =
	| 'lobhamula'
	| 'dosamula'
	| 'mohamula'
	| 'ahetuka-akusala-vipaka'
	| 'ahetuka-kusala-vipaka'
	| 'ahetuka-kiriya'
	| 'mahakusala'
	| 'mahavipaka'
	| 'mahakiriya'
	| 'rupavacara-kusala'
	| 'rupavacara-vipaka'
	| 'rupavacara-kiriya'
	| 'arupavacara-kusala'
	| 'arupavacara-vipaka'
	| 'arupavacara-kiriya'
	| 'magga'
	| 'phala';

export type CittaRow = {
	id: string;
	label: string;
	plane: 'kama' | 'rupa' | 'arupa' | 'lokuttara';
	jati: 'akusala' | 'kusala' | 'vipaka' | 'kiriya';
	group: CittaGroup;
	roots: 'lobha+moha' | 'dosa+moha' | 'moha' | 'none' | 'alobha+adosa+amoha' | 'alobha+adosa';
	feeling: 'somanassa' | 'upekkha' | 'domanassa' | 'dukkha' | 'sukha';
	feelingInferred: boolean;
	vk: 'with diṭṭhi' | 'without diṭṭhi' | 'with paṭigha' | 'with vicikicchā' | 'with uddhacca' | 'with ñāṇa' | 'without ñāṇa' | null;
	vkInferred: boolean;
	prompting: 'unprompted' | 'prompted' | null;
	sheetTotal: number;
	factors: string;
};

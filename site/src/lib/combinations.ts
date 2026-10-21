import { getCetasika } from './cetasikas.ts';
import { cittas89, factorOrder, lokuttara121 } from './citta-data.ts';
import type { CittaRow, FactorId, FactorState } from './types.ts';

export type Reckoning = 89 | 121;

export type CittaGroup = {
	id: string;
	label: string;
	pali: string;
	count89: number;
};

export type CittaSection = {
	id: 'akusala' | 'ahetuka' | 'kama-sobhana' | 'rupa' | 'arupa' | 'lokuttara';
	label: string;
	pali: string;
	groups: CittaGroup[];
};

/** The order and grouping of citta.md, "The Count". */
export const cittaSections: CittaSection[] = [
	{
		id: 'akusala',
		label: 'Unwholesome',
		pali: 'Akusala',
		groups: [
			{ id: 'lobhamula', label: 'Greed-rooted', pali: 'Lobha-mūla', count89: 8 },
			{ id: 'dosamula', label: 'Hatred-rooted', pali: 'Dosa-mūla', count89: 2 },
			{ id: 'mohamula', label: 'Delusion-rooted', pali: 'Moha-mūla', count89: 2 }
		]
	},
	{
		id: 'ahetuka',
		label: 'Rootless',
		pali: 'Ahetuka',
		groups: [
			{ id: 'ahetuka-akusala-vipaka', label: 'Unwholesome-resultant', pali: 'Akusala-vipāka', count89: 7 },
			{ id: 'ahetuka-kusala-vipaka', label: 'Wholesome-resultant', pali: 'Kusala-vipāka', count89: 8 },
			{ id: 'ahetuka-kiriya', label: 'Functional', pali: 'Kiriya', count89: 3 }
		]
	},
	{
		id: 'kama-sobhana',
		label: 'Beautiful sense-sphere',
		pali: 'Kāmāvacara sobhana',
		groups: [
			{ id: 'mahakusala', label: 'Great wholesome', pali: 'Mahākusala', count89: 8 },
			{ id: 'mahavipaka', label: 'Great resultant', pali: 'Mahāvipāka', count89: 8 },
			{ id: 'mahakiriya', label: 'Great functional', pali: 'Mahākiriya', count89: 8 }
		]
	},
	{
		id: 'rupa',
		label: 'Fine-material sphere',
		pali: 'Rūpāvacara',
		groups: [
			{ id: 'rupavacara-kusala', label: 'Wholesome', pali: 'Kusala', count89: 5 },
			{ id: 'rupavacara-vipaka', label: 'Resultant', pali: 'Vipāka', count89: 5 },
			{ id: 'rupavacara-kiriya', label: 'Functional', pali: 'Kiriya', count89: 5 }
		]
	},
	{
		id: 'arupa',
		label: 'Immaterial sphere',
		pali: 'Arūpāvacara',
		groups: [
			{ id: 'arupavacara-kusala', label: 'Wholesome', pali: 'Kusala', count89: 4 },
			{ id: 'arupavacara-vipaka', label: 'Resultant', pali: 'Vipāka', count89: 4 },
			{ id: 'arupavacara-kiriya', label: 'Functional', pali: 'Kiriya', count89: 4 }
		]
	},
	{
		id: 'lokuttara',
		label: 'Supramundane',
		pali: 'Lokuttara',
		groups: [
			{ id: 'magga', label: 'Path', pali: 'Magga', count89: 4 },
			{ id: 'phala', label: 'Fruition', pali: 'Phala', count89: 4 }
		]
	}
];

const lokuttaraFrom = cittas89.findIndex((c) => c.plane === 'lokuttara');

export function cittasFor(reckoning: Reckoning): CittaRow[] {
	if (reckoning === 89) return cittas89;
	return [...cittas89.slice(0, lokuttaraFrom), ...lokuttara121];
}

export function groupCittas(reckoning: Reckoning, groupId: string): CittaRow[] {
	return cittasFor(reckoning).filter((c) => c.group === groupId);
}

export function getCitta(id: string): CittaRow | undefined {
	return cittas89.find((c) => c.id === id) ?? lokuttara121.find((c) => c.id === id);
}

/** A factor's Pāli name, from cetasikas.ts. */
export const pali = (id: string) => getCetasika(id)?.pali ?? id;

const factorIndex = new Map<string, number>(factorOrder.map((id, i) => [id, i]));

export function stateOf(citta: CittaRow, factorId: string): FactorState {
	const i = factorIndex.get(factorId);
	if (i === undefined) throw new Error(`Unknown factor ${factorId}`);
	return citta.factors[i] as FactorState;
}

export function factorsIn(citta: CittaRow, state: FactorState): string[] {
	return factorOrder.filter((_, i) => citta.factors[i] === state);
}

export type FactorReach = { fixed: number; optional: number; total: number };

export function reachOf(reckoning: Reckoning, factorId: string): FactorReach {
	let fixed = 0;
	let optional = 0;
	for (const c of cittasFor(reckoning)) {
		const s = stateOf(c, factorId);
		if (s === 'F') fixed++;
		else if (s === 'O') optional++;
	}
	return { fixed, optional, total: fixed + optional };
}

/** Names as the sheets write them, for descriptive labels. */
export const jatiLabel: Record<CittaRow['jati'], string> = {
	akusala: 'unwholesome (akusala)',
	kusala: 'wholesome (kusala)',
	vipaka: 'resultant (vipāka)',
	kiriya: 'functional (kiriya)'
};

export const planeLabel: Record<CittaRow['plane'], string> = {
	kama: 'sense sphere (kāmāvacara)',
	rupa: 'fine-material sphere (rūpāvacara)',
	arupa: 'immaterial sphere (arūpāvacara)',
	lokuttara: 'supramundane (lokuttara)'
};

export const feelingLabel: Record<string, string> = {
	somanassa: 'joy (somanassa)',
	upekkha: 'equanimity (upekkhā)',
	domanassa: 'displeasure (domanassa)',
	dukkha: 'bodily pain (dukkha)',
	sukha: 'bodily pleasure (sukha)'
};

export function groupOf(citta: CittaRow): { section: CittaSection; group: CittaGroup } {
	for (const section of cittaSections) {
		const group = section.groups.find((g) => g.id === citta.group);
		if (group) return { section, group };
	}
	throw new Error(`No group for ${citta.id}`);
}

/** The citta's family name, one place for every view: the section for rūpa/arūpa, the group otherwise. */
export function familyOf(citta: CittaRow): { label: string; pali: string } {
	const { section, group } = groupOf(citta);
	if (section.id === 'rupa' || section.id === 'arupa') return { label: section.label, pali: section.pali };
	if (section.id === 'lokuttara') return { label: `${section.label} ${group.label.toLowerCase()}`, pali: group.pali };
	if (section.id === 'ahetuka') return { label: `Rootless ${group.label.toLowerCase()}`, pali: group.pali };
	return { label: group.label, pali: group.pali };
}

/** An unambiguous name for one citta, e.g. "Great wholesome · joy · with knowledge · unprompted". */
export function fullLabel(citta: CittaRow): string {
	const { section, group } = groupOf(citta);
	const lead =
		section.id === 'rupa' || section.id === 'arupa'
			? `${section.label} · ${group.label.toLowerCase()}`
			: familyOf(citta).label;
	return `${lead} · ${citta.label}`;
}

/** The same citta on the other reckoning: 89 ids gain "-j1", 121 jhāna ids lose their "-jN". */
export function counterpart(id: string, reckoning: Reckoning): string | null {
	const ids = new Set(cittasFor(reckoning).map((c) => c.id));
	if (ids.has(id)) return id;
	const mapped = reckoning === 121 ? `${id}-j1` : id.replace(/-j\d$/, '');
	return ids.has(mapped) ? mapped : null;
}

// ---------------------------------------------------------------------------
// Rules. Only the rules sampayoga.md, "Exclusivity and Co-Arising Rules", states,
// plus the thīna/middha pairing from cetasika.md. No rule here is inferred.

export type RuleKind = 'never-together' | 'one-at-a-time' | 'requires' | 'absent' | 'pair';

export type Rule = {
	id: string;
	title: string;
	kind: RuleKind;
	factors: string[];
	/** Factors the rule's sentence names without constraining them (shown with that factor, not toggled). */
	mentions?: string[];
	/** True when the Build-a-moment toggles enforce it; otherwise the citta data already encodes it. */
	acts: boolean;
	scope: string;
	quote: string;
	source: string;
};

const RULES = 'sampayoga.md — Exclusivity and Co-Arising Rules';

export const rules: Rule[] = [
	{
		id: 'lobha-dosa',
		title: 'Greed and hatred never co-arise',
		kind: 'never-together',
		factors: ['lobha', 'dosa'],
		mentions: ['moha'],
		acts: false,
		scope: 'All cittas. Lobha is in the 8 greed-rooted cittas, dosa in the 2 hatred-rooted; delusion is in all 12.',
		quote: 'Greed and hatred never co-arise, though delusion accompanies both.',
		source: RULES
	},
	{
		id: 'ditthi-mana',
		title: 'Wrong view and conceit never co-arise',
		kind: 'never-together',
		factors: ['ditthi', 'mana'],
		acts: false,
		scope: 'The 8 greed-rooted cittas. View is fixed in the 4 with view; conceit may arise only in the 4 without it.',
		quote: 'Diṭṭhi and māna never co-arise.',
		source: RULES
	},
	{
		id: 'issa-macchariya-kukkucca',
		title: 'Envy, stinginess and worry arise singly',
		kind: 'one-at-a-time',
		factors: ['issa', 'macchariya', 'kukkucca'],
		acts: true,
		scope: 'The 2 hatred-rooted cittas. At most one is present in any moment, and none is required.',
		quote: 'Issā, macchariya and kukkucca arise singly and never together.',
		source: RULES
	},
	{
		id: 'vicikiccha-adhimokkha',
		title: 'The doubt citta lacks determination',
		kind: 'absent',
		factors: ['vicikiccha', 'adhimokkha'],
		acts: false,
		scope: 'The delusion-rooted citta with doubt. Outside the sense consciousnesses, it is the only citta without adhimokkha.',
		quote: 'The doubt-accompanied citta lacks adhimokkha entirely.',
		source: RULES
	},
	{
		id: 'piti-somanassa',
		title: 'Rapture requires joy',
		kind: 'requires',
		factors: ['piti'],
		acts: false,
		scope: 'Pīti occurs only where the feeling is somanassa, but not in every such citta: the fourth-jhāna cittas keep joy and have no rapture.',
		quote: 'Pīti requires somanassa but is not guaranteed by it.',
		source: RULES
	},
	{
		id: 'virati',
		title: 'The abstinences: one at a time, or all three',
		kind: 'one-at-a-time',
		factors: ['samma-vaca', 'samma-kammanta', 'samma-ajiva'],
		acts: true,
		scope: 'At most one, and often none, in the 8 great wholesome cittas. All three, fixed, in every supramundane citta.',
		quote:
			'The three virati arise one at a time in mundane wholesome consciousness, all three at once in every supramundane consciousness.',
		source: RULES
	},
	{
		id: 'karuna-mudita',
		title: 'Compassion and appreciative joy never co-arise',
		kind: 'one-at-a-time',
		factors: ['karuna', 'mudita'],
		acts: true,
		scope: 'Where they occur at all, at most one is present. Neither occurs in the supramundane.',
		quote: 'Karuṇā and muditā never co-arise, and neither occurs in the supramundane.',
		source: RULES
	},
	{
		id: 'thina-middha',
		title: 'Sloth and torpor arise together',
		kind: 'pair',
		factors: ['thina', 'middha'],
		acts: true,
		scope: 'The 5 prompted unwholesome cittas, where both are optional. Never in unprompted ones.',
		quote: 'Thīna afflicts the mind, middha its retinue, and when either is present the other is present with it.',
		source: 'cetasika.md — 13. Middha'
	}
];

export function rulesFor(factorId: string): Rule[] {
	return rules.filter((r) => r.factors.includes(factorId) || r.mentions?.includes(factorId));
}

// ---------------------------------------------------------------------------
// Build a moment: choose which optional factors are present in one moment of a citta.

export type ToggleResult = {
	on: Set<string>;
	/** Factors switched off or on as a consequence, with the rule that did it. */
	effect?: { rule: Rule; changed: string[]; turnedOn: boolean };
};

export function toggleOptional(citta: CittaRow, on: Set<string>, factorId: string): ToggleResult {
	if (stateOf(citta, factorId) !== 'O') return { on };
	const next = new Set(on);
	const turningOn = !next.has(factorId);
	if (turningOn) next.add(factorId);
	else next.delete(factorId);

	for (const rule of rules) {
		if (!rule.acts || !rule.factors.includes(factorId)) continue;
		const others = rule.factors.filter((f) => f !== factorId && stateOf(citta, f) === 'O');
		if (rule.kind === 'pair') {
			const changed = others.filter((f) => next.has(f) !== turningOn);
			for (const f of changed) {
				if (turningOn) next.add(f);
				else next.delete(f);
			}
			if (changed.length) return { on: next, effect: { rule, changed, turnedOn: turningOn } };
		} else if (rule.kind === 'one-at-a-time' && turningOn) {
			const changed = others.filter((f) => next.has(f));
			for (const f of changed) next.delete(f);
			if (changed.length) return { on: next, effect: { rule, changed, turnedOn: false } };
		}
	}
	return { on: next };
}

/** The most optional factors one moment can hold, after the one-at-a-time rules. */
export function maxTogether(citta: CittaRow): number {
	const optional = factorsIn(citta, 'O');
	let n = optional.length;
	for (const rule of rules) {
		if (rule.kind !== 'one-at-a-time') continue;
		const here = rule.factors.filter((f) => optional.includes(f)).length;
		if (here > 1) n -= here - 1;
	}
	return factorsIn(citta, 'F').length + n;
}

// The drift guard against the sheets lives in _combinations-guard.mjs (run by _bugcheck.mjs), so a
// mismatch fails the check script and never blanks the page in the browser.

/** Cittas with somanassa: 38 on 89, 62 on 121 (the sheet's "sixty-two" is a 121 figure). */
const joyful = (r: Reckoning) => cittasFor(r).filter((c) => c.feeling === 'somanassa').length;
export const somanassaCount = { 89: joyful(89), 121: joyful(121) } as const;

// ---------------------------------------------------------------------------
// Moment wheel helpers (presentation only: no count or rule is added here).

/** Sub-arcs of the wheel's outer ring, in factorOrder. Named from sampayoga.md,
 *  "Sampayoga — Factor by Factor", sections 3 and 4 (the unwholesome rows by where they arise). */
export type WheelArc = { id: string; side: 'unwholesome' | 'beautiful'; label: string; factors: string[] };
const slice = (from: FactorId, to: FactorId): string[] => factorOrder.slice(factorOrder.indexOf(from), factorOrder.indexOf(to) + 1);
export const wheelArcs: WheelArc[] = [
	{ id: 'akusala-universal', side: 'unwholesome', label: 'universal unwholesome', factors: slice('moha', 'uddhacca') },
	{ id: 'greed', side: 'unwholesome', label: 'greed-rooted', factors: slice('lobha', 'mana') },
	{ id: 'hatred', side: 'unwholesome', label: 'hatred-rooted', factors: slice('dosa', 'kukkucca') },
	{ id: 'prompted', side: 'unwholesome', label: 'prompted', factors: slice('thina', 'middha') },
	{ id: 'doubt', side: 'unwholesome', label: 'doubt', factors: ['vicikiccha'] },
	{ id: 'sobhana-universal', side: 'beautiful', label: 'universal beautiful', factors: slice('saddha', 'cittujjukata') },
	{ id: 'virati', side: 'beautiful', label: 'abstinences', factors: slice('samma-vaca', 'samma-ajiva') },
	{ id: 'appamanna', side: 'beautiful', label: 'illimitables', factors: ['karuna', 'mudita'] },
	{ id: 'panna', side: 'beautiful', label: 'wisdom', factors: ['pannindriya'] }
];

/** Plain words for the attributes the data writes in Pāli. */
export const vkPlain: Record<string, string> = {
	'with diṭṭhi': 'with wrong view',
	'without diṭṭhi': 'without wrong view',
	'with ñāṇa': 'with knowledge',
	'without ñāṇa': 'without knowledge',
	'with paṭigha': 'with aversion',
	'with vicikicchā': 'with doubt',
	'with uddhacca': 'with restlessness'
};

export type QuestionId =
	| 'plane'
	| 'section'
	| 'jati'
	| 'group'
	| 'stage'
	| 'jhana'
	| 'which'
	| 'feeling'
	| 'vk'
	| 'prompting';
export type Question = {
	id: QuestionId;
	title: (sample: CittaRow) => string;
	value: (c: CittaRow) => string | null;
	label: (value: string) => { plain: string; pali?: string };
};

const split = (s: string) => {
	const m = /^(.*?) \((.*)\)$/.exec(s);
	return m ? { plain: m[1], pali: m[2] } : { plain: s };
};
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** The composer's questions, in asking order. A question is asked only when its
 *  values still differ among the remaining candidates. */
export const questions: Question[] = [
	{ id: 'plane', title: () => 'Plane', value: (c) => c.plane, label: (v) => ((s) => ({ plain: cap(s.plain), pali: s.pali }))(split(planeLabel[v as CittaRow['plane']])) },
	{
		id: 'section',
		title: () => 'Kind',
		value: (c) => groupOf(c).section.id,
		label: (v) => {
			const s = cittaSections.find((x) => x.id === v);
			if (!s) return { plain: v };
			return { plain: s.label, pali: s.pali };
		}
	},
	{ id: 'jati', title: () => 'Quality', value: (c) => c.jati, label: (v) => ((s) => ({ plain: cap(s.plain), pali: s.pali }))(split(jatiLabel[v as CittaRow['jati']])) },
	{
		id: 'group',
		title: (c) => (groupOf(c).section.id === 'akusala' ? 'Root' : 'Group'),
		value: (c) => c.group,
		label: (v) => {
			const g = cittaSections.flatMap((s) => s.groups).find((x) => x.id === v);
			if (!g) return { plain: v };
			return { plain: g.label, pali: g.pali };
		}
	},
	{ id: 'stage', title: () => 'Stage', value: (c) => (c.plane === 'lokuttara' ? c.label.split(' · ')[0] : null), label: (v) => ({ plain: cap(v) }) },
	{ id: 'jhana', title: () => 'Jhāna', value: (c) => /jhāna (\d)/.exec(c.label)?.[1] ?? null, label: (v) => ({ plain: `Jhāna ${v}` }) },
	{
		id: 'which',
		title: (c) => (c.plane === 'arupa' ? 'Object' : 'Which consciousness'),
		value: (c) => (c.group.startsWith('ahetuka') || c.plane === 'arupa' ? c.label.split(' · ')[0] : null),
		label: (v) => ({ plain: cap(v) })
	},
	{ id: 'feeling', title: () => 'Feeling', value: (c) => c.feeling, label: (v) => ((s) => ({ plain: cap(s.plain), pali: s.pali }))(split(feelingLabel[v] ?? v)) },
	{ id: 'vk', title: () => 'Accompanied by', value: (c) => c.vk, label: (v) => ({ plain: vkPlain[v] ?? v, pali: v }) },
	{
		id: 'prompting',
		title: () => 'Prompting',
		value: (c) => c.prompting,
		label: (v) => (v === 'prompted' ? { plain: 'Prompted', pali: 'sasaṅkhārika' } : { plain: 'Unprompted', pali: 'asaṅkhārika' })
	}
];

export type Answers = Partial<Record<QuestionId, string | null>>;

export function answersOf(c: CittaRow): Answers {
	return Object.fromEntries(questions.map((q) => [q.id, q.value(c)]));
}

export function fitsAnswers(c: CittaRow, answers: Answers): boolean {
	return questions.every((q) => !(q.id in answers) || q.value(c) === answers[q.id]);
}

/** Starting points: real citta ids, labelled only by the citta's own attributes. */
export const presetIds: { 89: string; 121: string }[] = [
	{ 89: 'lobha-joy-view-unprompted', 121: 'lobha-joy-view-unprompted' },
	{ 89: 'dosa-unprompted', 121: 'dosa-unprompted' },
	{ 89: 'moha-doubt', 121: 'moha-doubt' },
	{ 89: 'kv-eye', 121: 'kv-eye' },
	{ 89: 'mahakusala-joy-knowledge-unprompted', 121: 'mahakusala-joy-knowledge-unprompted' },
	{ 89: 'rupa-kusala-1', 121: 'rupa-kusala-1' },
	{ 89: 'magga-sotapatti', 121: 'magga-sotapatti-j1' }
];

export type Absence = { factors: string[]; text: string; rule?: Rule; source: string };

const PARTITION = 'sampayoga.md — Sampayoga — Factor by Factor, sections 3 and 4';
const rule = (id: string) => rules.find((r) => r.id === id);

/** The one or two absences that change the reading, from the data and the stated rules only. */
export function notableAbsences(c: CittaRow): Absence[] {
	const out: Absence[] = [];
	const absent = (f: string) => stateOf(c, f) === '-';
	const present = (f: string) => !absent(f);
	const ruled = (id: string, factors: string[], text: string) => {
		const r = rule(id);
		if (!r) return; // the drift guard checks every rule id; never blank the reading over one
		out.push({ factors, text, rule: r, source: r.source });
	};
	if (present('vicikiccha')) ruled('vicikiccha-adhimokkha', ['adhimokkha'], 'No adhimokkha (determination). The doubt citta lacks it entirely.');
	else if (present('ditthi')) ruled('ditthi-mana', ['mana'], 'No māna (conceit). Wrong view is fixed here, and the two never co-arise.');
	else if (present('mana')) ruled('ditthi-mana', ['ditthi'], 'No diṭṭhi (wrong view). Without view, conceit may arise instead; the two never co-arise.');
	else if (present('dosa')) ruled('lobha-dosa', ['lobha'], 'No lobha (greed). Greed and hatred never co-arise.');
	else if (c.feeling === 'somanassa' && absent('piti'))
		ruled('piti-somanassa', ['piti'], 'No pīti (rapture), though the feeling is joy. Rapture requires joy but is not guaranteed by it.');
	else if (c.plane === 'lokuttara') ruled('karuna-mudita', ['karuna', 'mudita'], 'No karuṇā or muditā. Neither illimitable occurs in the supramundane.');
	else if (c.feeling !== 'somanassa' && present('vitakka') && absent('piti'))
		ruled('piti-somanassa', ['piti'], `No pīti (rapture). The feeling is ${split(feelingLabel[c.feeling] ?? c.feeling).plain}, and rapture requires joy.`);

	const beautiful = present('saddha');
	if (c.jati === 'akusala')
		out.push({ factors: [], text: 'None of the 25 beautiful factors. Unwholesome and beautiful cittas are separate classes, so this says nothing special about any one factor.', source: PARTITION });
	else if (!beautiful)
		out.push({
			factors: [],
			text:
				factorsIn(c, 'F').length === 7
					? 'No root, and none of the 14 unwholesome or 25 beautiful factors: the seven universals and nothing else.'
					: 'No root, and none of the 14 unwholesome or 25 beautiful factors: the seven universals and some of the occasionals.',
			source: factorsIn(c, 'F').length === 7 ? 'sampayoga.md — Saṅgaha — Citta by Citta, section 2' : PARTITION
		});
	else if (absent('pannindriya'))
		out.push({ factors: ['pannindriya'], text: 'No paññindriya (wisdom). This citta is without knowledge.', source: PARTITION });
	else out.push({ factors: [], text: 'None of the 14 unwholesome factors. Beautiful and unwholesome cittas are separate classes.', source: PARTITION });
	return out.slice(0, 2);
}

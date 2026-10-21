import { readFileSync } from 'node:fs';
import { cetasikas } from './src/lib/cetasikas.ts';
import { confusions } from './src/lib/confusions.ts';
import { terms } from './src/lib/terms.ts';
import { groupMeta } from './src/lib/labels.ts';
import { groupOrder } from './src/lib/cetasikas.ts';
import { renderMarkdown, slugify } from './src/lib/markdown.ts';

const sheet = readFileSync('../cetasika.md', 'utf8');
const full = renderMarkdown(sheet);
const fullIds = new Set([...full.html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]));

const mismatches = [];
for (const f of cetasikas) {
	const escaped = f.pali.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const pattern = new RegExp(`^### \\d+\\. ${escaped} — .+$`, 'm');
	const match = pattern.exec(sheet);
	if (!match) {
		mismatches.push({ id: f.id, pali: f.pali, err: 'NO MATCH in sheet' });
		continue;
	}
	const heading = match[0].replace(/^###\s+/, '');
	const sectionId = slugify(heading);
	if (!fullIds.has(sectionId)) {
		mismatches.push({ id: f.id, pali: f.pali, sectionId, err: 'section id not in full sheet' });
	}
}
console.log('factor section mismatches', mismatches);

const termIds = new Set();
for (const t of terms) {
	if (termIds.has(t.id)) console.log('dup term', t.id);
	termIds.add(t.id);
	for (const i of t.stress) {
		if (i < 0 || i >= t.syllables.length) console.log('bad stress', t.id, i);
	}
}
const cetIds = new Set(cetasikas.map((c) => c.id));
console.log(
	'term/cetasika id overlap',
	terms.filter((t) => cetIds.has(t.id)).map((t) => t.id)
);

for (const file of ['citta.md', 'cetasika.md', 'sampayoga.md', 'vithi.md']) {
	const md = readFileSync(`../${file}`, 'utf8');
	const lines = md.split('\n');
	const issues = [];
	for (let i = 0; i < lines.length; i++) {
		const l = lines[i];
		if (/^#{4,}/.test(l)) issues.push({ line: i + 1, kind: 'h4+', text: l.slice(0, 100) });
		if (/^\s*[-*+]\s/.test(l)) issues.push({ line: i + 1, kind: 'list', text: l.slice(0, 100) });
		if (/^\s*\d+\.\s/.test(l) && !l.startsWith('#'))
			issues.push({ line: i + 1, kind: 'olist', text: l.slice(0, 100) });
		if (/\[[^\]]+\]\([^)]+\)/.test(l)) issues.push({ line: i + 1, kind: 'link', text: l.slice(0, 100) });
		if (/^```/.test(l)) issues.push({ line: i + 1, kind: 'fence', text: l.slice(0, 100) });
		if (/^>/.test(l)) issues.push({ line: i + 1, kind: 'quote', text: l.slice(0, 100) });
	}
	console.log(file, issues.length ? issues : 'clean');
}

for (const file of ['citta.md', 'cetasika.md', 'sampayoga.md', 'vithi.md']) {
	const { html } = renderMarkdown(readFileSync(`../${file}`, 'utf8'));
	if (html.includes('**')) console.log(file, 'UNPARSED BOLD');
	if (html.includes('<em></em>')) console.log(file, 'empty em');
}

const b19 = cetasikas.filter((c) => c.range === 'All 59 beautiful cittas. Fixed there.');
console.log('beautiful19 count', b19.length);

for (const g of groupOrder) {
	const n = cetasikas.filter((c) => c.group === g).length;
	if (n !== groupMeta[g].count) console.log('LABEL COUNT MISMATCH', g, n, groupMeta[g].count);
}

// Check confusion drillIds / members
for (const c of confusions) {
	for (const m of c.members) {
		if (!getSafe(m.id)) console.log('bad member', c.id, m.id);
	}
}

/** @param {string} id */
function getSafe(id) {
	return cetasikas.some((f) => f.id === id);
}

// Syllable text concat vs pali (rough). Many differ by design (hyphens, spacing), so print a count;
// set BUGCHECK_VERBOSE=1 for the lines.
const sylls = [];
for (const f of cetasikas) {
	const joined = f.syllables.map((s) => s.text).join('');
	const compact = f.pali.replace(/\s+/g, '');
	if (joined !== compact) sylls.push(['syllable join != pali', f.id, joined, '|', compact]);
}
for (const t of terms) {
	const joined = t.syllables.map((s) => s.text).join('');
	const compact = t.pali.replace(/\s+/g, '');
	if (joined !== compact) sylls.push(['term syllable join != pali', t.id, joined, '|', compact]);
}
if (process.env.BUGCHECK_VERBOSE) for (const l of sylls) console.log(...l);
console.log('syllable join differences', sylls.length, process.env.BUGCHECK_VERBOSE ? '' : '(BUGCHECK_VERBOSE=1 to list)');

// Home anchors
const homeAnchors = [
	['sampayoga.md', '2-ahetuka-citta-rootless'],
	['sampayoga.md', '3-akusala-the-fourteen-unwholesome'],
	['sampayoga.md', '4-sobhana-the-twenty-five-beautiful'],
	['vithi.md', '8-votthapana-determining']
];
for (const [file, id] of homeAnchors) {
	const { html } = renderMarkdown(readFileSync(`../${file}`, 'utf8'));
	console.log('anchor', id, html.includes(`id="${id}"`));
}

console.log('counts', {
	cetasikas: cetasikas.length,
	confusions: confusions.length,
	terms: terms.length
});

// Drift guard for the Combinations explorer, last so its result is the final line. Every figure it
// checks is parsed from the sheets (see _combinations-guard.mjs); a mismatch exits non-zero.
const { checkCombinations } = await import('./_combinations-guard.mjs');
const data = await import('./src/lib/citta-data.ts');
const combos = await import('./src/lib/combinations.ts');
const fails = checkCombinations({
	cittas89: data.cittas89,
	lokuttara121: data.lokuttara121,
	factorOrder: data.factorOrder,
	cetasikas,
	cittaSections: combos.cittaSections,
	rules: combos.rules,
	presetIds: combos.presetIds,
	wheelArcs: combos.wheelArcs
});
console.log('\n== combinations drift guard ==');
if (fails.length) {
	for (const f of fails) console.log('  DRIFT', f);
	console.log(`combinations drift: ${fails.length} failure(s)`);
	process.exit(1);
}
console.log('combinations drift: clean');

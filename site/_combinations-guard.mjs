// @ts-nocheck -- node-only check script; it reads loosely typed parsed markdown.
// Drift guard for the Combinations explorer. Run from _bugcheck.mjs (node, never shipped to the browser).
// Every figure it compares against is parsed from the sheets themselves; the only numbers written here are
// ordinal words and the site's own derived figures, which are labelled as derived.
import { readFileSync } from 'node:fs';

/** @param {string} file */
export function readSheet(file) {
	return readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
}

/** The body of the section whose heading line is exactly `heading` (any level), up to the next heading of that level or higher. */
function section(md, heading) {
	const lines = md.split('\n');
	const start = lines.findIndex((l) => /^#+ /.test(l) && l.replace(/^#+ /, '') === heading);
	if (start < 0) return null;
	const level = /^#+/.exec(lines[start])[0].length;
	const end = lines.findIndex((l, i) => i > start && /^#+ /.test(l) && /^#+/.exec(l)[0].length <= level);
	return lines.slice(start + 1, end < 0 ? undefined : end).join('\n');
}

/** Rows of `| a | b | ... |` tables in a block of markdown. */
function tableRows(md) {
	return md
		.split('\n')
		.filter((l) => l.startsWith('|') && !/^\|\s*-/.test(l))
		.map((l) => l.split('|').slice(1, -1).map((c) => c.trim()));
}

const norm = (s) =>
	s
		.normalize('NFD')
		.replace(/\p{M}/gu, '')
		.toLowerCase()
		.replace(/[\s-]/g, '');

const ordinal = { 1: 'First', 2: 'Second', 3: 'Third', 4: 'Fourth', 5: 'Fifth' };
const ordinalLower = (n) => ordinal[n].toLowerCase();

/** The sampayoga Saṅgaha row that prints this citta's total. */
function sangahaRow(c, groupSection) {
	const joy = c.feeling === 'somanassa' ? 'joy' : 'neutral';
	const jhana = /jhāna (\d)/.exec(c.label)?.[1];
	switch (groupSection) {
		case 'akusala':
			if (c.group === 'lobhamula')
				return `Greed-rooted, ${joy}, ${c.vk === 'with diṭṭhi' ? 'with view' : 'without view'}, ${c.prompting}`;
			if (c.group === 'dosamula') return `Hatred-rooted, ${c.prompting}`;
			return c.vk === 'with vicikicchā' ? 'Delusion-rooted with doubt' : 'Delusion-rooted with restlessness';
		case 'ahetuka':
			if (/ consciousness$/.test(c.label)) return 'The ten sense consciousnesses';
			if (c.label === 'receiving' || c.label === 'five-door adverting' || (c.label.startsWith('investigating') && c.feeling === 'upekkha'))
				return 'Receiving (2), investigating with neutral feeling (2), five-door adverting';
			if (c.label.startsWith('investigating')) return 'Investigating with joy';
			if (c.label === 'mind-door adverting') return 'Mind-door adverting';
			return 'Smile-producing';
		case 'kama-sobhana': {
			const kind = { mahakusala: 'wholesome', mahavipaka: 'resultant', mahakiriya: 'functional' }[c.group];
			return `Great ${kind}, ${joy}, ${c.vk === 'with ñāṇa' ? 'with knowledge' : 'without knowledge'}`;
		}
		case 'rupa':
			return `Fine-material, ${ordinalLower(jhana)} jhāna`;
		case 'arupa':
			return 'Immaterial, all four attainments';
		case 'lokuttara':
			// On 89 every supramundane citta is reckoned first-jhāna ("each has thirty-six").
			return !jhana || jhana === '1' ? 'First-jhāna path or fruition' : `${ordinal[jhana]} jhāna`;
	}
}

/**
 * @param {{ cittas89: any[]; lokuttara121: any[]; factorOrder: readonly string[]; cetasikas: any[];
 *   cittaSections: any[]; rules: any[]; presetIds: any[]; wheelArcs: any[] }} data
 * @returns {string[]} failures
 */
export function checkCombinations(data) {
	const { cittas89, lokuttara121, factorOrder, cetasikas, cittaSections, rules, presetIds, wheelArcs } = data;
	const sheets = {
		'citta.md': readSheet('citta.md'),
		'cetasika.md': readSheet('cetasika.md'),
		'sampayoga.md': readSheet('sampayoga.md')
	};
	const S = sheets['sampayoga.md'];
	const fails = [];
	const check = (ok, msg) => {
		if (!ok) fails.push(msg);
	};

	const idx = new Map(factorOrder.map((id, i) => [id, i]));
	const st = (c, f) => c.factors[idx.get(f)];
	const from = cittas89.findIndex((c) => c.plane === 'lokuttara');
	const all = { 89: cittas89, 121: [...cittas89.slice(0, from), ...lokuttara121] };
	const groupSection = new Map(cittaSections.flatMap((s) => s.groups.map((g) => [g.id, s.id])));
	const reach = (r, f) => all[r].filter((c) => st(c, f) !== '-').length;
	const range = (a, b) => factorOrder.slice(idx.get(a), idx.get(b) + 1);

	// --- The count (citta.md, "The Count").
	const countRows = tableRows(section(sheets['citta.md'], 'The Count') ?? '');
	const planeCount = Object.fromEntries(
		countRows
			.filter((r) => /—/.test(r[0]))
			.map((r) => [{ Kāmāvacara: 'kama', Rūpāvacara: 'rupa', Arūpāvacara: 'arupa', Lokuttara: 'lokuttara' }[r[0].split(' ')[0]], Number(r[1])])
	);
	const total89 = Number(countRows.find((r) => r[0] === '**Total**')?.[1].replace(/\*/g, ''));
	const total121 = Number(/alternate total of (\d+)/.exec(sheets['citta.md'])?.[1]);
	const lokuttaraPer = Number(/giving (\d+) in place of 8/.exec(sheets['citta.md'])?.[1]);
	check(cittas89.length === total89, `expected ${total89} cittas (citta.md), found ${cittas89.length}`);
	check(all[121].length === total121, `expected ${total121} cittas on the alternate reckoning, found ${all[121].length}`);
	check(lokuttara121.length === lokuttaraPer, `expected ${lokuttaraPer} supramundane cittas on 121, found ${lokuttara121.length}`);
	for (const [plane, n] of Object.entries(planeCount))
		check(cittas89.filter((c) => c.plane === plane).length === n, `plane ${plane} should have ${n} cittas`);
	check(Object.keys(planeCount).length === 4, 'could not parse the four planes from citta.md');

	// --- Factors.
	check(factorOrder.length === cetasikas.length && factorOrder.every((id, i) => cetasikas[i]?.id === id), 'factor order no longer matches cetasikas.ts');
	for (const s of cittaSections)
		for (const g of s.groups) check(cittas89.filter((c) => c.group === g.id).length === g.count89, `group ${g.id} should have ${g.count89}`);

	// --- Per-citta totals against the Saṅgaha tables.
	const sangaha = new Map(tableRows(section(S, 'Saṅgaha — Citta by Citta') ?? '').map((r) => [r[0], Number(r[1])]));
	check(sangaha.size > 20, 'could not parse the Saṅgaha tables');
	const seen = new Set();
	for (const c of [...cittas89, ...lokuttara121]) {
		check(!seen.has(c.id), `duplicate citta id ${c.id}`);
		seen.add(c.id);
		check(c.factors.length === factorOrder.length && /^[FO-]+$/.test(c.factors), `bad factor string for ${c.id}`);
		const present = c.factors.replace(/-/g, '').length;
		check(present === c.sheetTotal, `${c.id} has ${present} factors, sheetTotal says ${c.sheetTotal}`);
		const row = sangahaRow(c, groupSection.get(c.group));
		check(sangaha.has(row), `${c.id}: no Saṅgaha row "${row}"`);
		check(sangaha.get(row) === c.sheetTotal, `${c.id}: sheetTotal ${c.sheetTotal}, the Saṅgaha row "${row}" prints ${sangaha.get(row)}`);
	}

	// --- Niyata and aniyata (sampayoga.md, "Niyata and Aniyata").
	const niyata = section(S, 'Niyata and Aniyata') ?? '';
	const aniyataText = /Eleven factors are aniyata: ([^.]+)\./.exec(niyata)?.[1] ?? '';
	const aniyataNames = {
		conceit: ['mana'],
		envy: ['issa'],
		stinginess: ['macchariya'],
		worry: ['kukkucca'],
		sloth: ['thina'],
		torpor: ['middha'],
		'the three abstinences': ['samma-vaca', 'samma-kammanta', 'samma-ajiva'],
		compassion: ['karuna'],
		'appreciative joy': ['mudita']
	};
	const listed = aniyataText.split(/, (?:and )?/).map((s) => s.trim());
	check(listed.length === Object.keys(aniyataNames).length && listed.every((n) => n in aniyataNames), `aniyata list changed: "${aniyataText}"`);
	const aniyata = new Set(listed.flatMap((n) => aniyataNames[n] ?? []));
	check(aniyata.size === 11, `expected eleven aniyata, parsed ${aniyata.size}`);
	const everOptional = new Set(factorOrder.filter((f) => [...cittas89, ...lokuttara121].some((c) => st(c, f) === 'O')));
	check(
		everOptional.size === aniyata.size && [...everOptional].every((f) => aniyata.has(f)),
		`factors ever optional [${[...everOptional]}] differ from the eleven aniyata [${[...aniyata]}]`
	);

	// An aniyata factor is never fixed, except the abstinences in the supramundane ("the distinction collapses").
	const viratiIds = ['samma-vaca', 'samma-kammanta', 'samma-ajiva'];
	check(/one place the distinction collapses is supramundane consciousness/.test(niyata), 'supramundane exception sentence moved');
	for (const c of [...cittas89, ...lokuttara121])
		for (const f of aniyata)
			if (!(c.plane === 'lokuttara' && viratiIds.includes(f))) check(st(c, f) !== 'F', `${f} is aniyata but fixed in ${c.id}`);

	const universals = range('phassa', 'manasikara');
	const akusalaUniversals = range('moha', 'uddhacca');
	const beautifulUniversals = range('saddha', 'cittujjukata');
	const virati = range('samma-vaca', 'samma-ajiva');
	check(universals.length === 7 && akusalaUniversals.length === 4 && beautifulUniversals.length === 19, 'universal ranges moved');
	const akusala = cittas89.filter((c) => c.jati === 'akusala');
	const sobhana = cittas89.filter((c) => st(c, 'saddha') !== '-');
	check(/four unwholesome universals are niyata in all twelve unwholesome/.test(niyata) && akusala.length === 12, 'unwholesome universals: sheet or count changed');
	check(/nineteen beautiful universals are niyata in all fifty-nine beautiful/.test(niyata) && sobhana.length === 59, 'beautiful universals: sheet or count changed');
	for (const c of [...cittas89, ...lokuttara121]) {
		for (const u of universals) check(st(c, u) === 'F', `${u} is a universal but not fixed in ${c.id}`);
		if (c.jati === 'akusala') for (const u of akusalaUniversals) check(st(c, u) === 'F', `${u} not fixed in unwholesome ${c.id}`);
		const beautiful = c.jati !== 'akusala' && c.roots !== 'none';
		for (const u of beautifulUniversals)
			check(beautiful ? st(c, u) === 'F' : st(c, u) === '-', `${u} should be ${beautiful ? 'fixed' : 'absent'} in ${c.id}`);
		// The three virati: optional in the great wholesome, fixed in the supramundane, absent elsewhere.
		const want = c.group === 'mahakusala' ? 'O' : c.plane === 'lokuttara' ? 'F' : '-';
		for (const v of virati) check(st(c, v) === want, `${v} should be ${want} in ${c.id}`);

		// Rules the data must already encode (sampayoga.md, "Exclusivity and Co-Arising Rules").
		check(!(st(c, 'lobha') !== '-' && st(c, 'dosa') !== '-'), `lobha and dosa together in ${c.id}`);
		check(!(st(c, 'ditthi') !== '-' && st(c, 'mana') !== '-'), `diṭṭhi and māna together in ${c.id}`);
		if (st(c, 'vicikiccha') !== '-') check(st(c, 'adhimokkha') === '-', `adhimokkha with doubt in ${c.id}`);
		if (st(c, 'piti') !== '-') check(c.feeling === 'somanassa', `pīti without somanassa in ${c.id}`);
		if (c.plane === 'lokuttara') {
			check(st(c, 'pannindriya') === 'F', `wisdom should be fixed in ${c.id}`);
			check(st(c, 'karuna') === '-' && st(c, 'mudita') === '-', `illimitables in ${c.id}`);
		}
		if (st(c, 'thina') !== '-') check(c.jati === 'akusala' && c.prompting === 'prompted', `thīna in ${c.id}`);
		check(st(c, 'thina') === st(c, 'middha'), `thīna and middha differ in ${c.id}`);
	}

	// --- Per-factor reach against "Sampayoga — Factor by Factor".
	const byName = new Map(cetasikas.map((c) => [norm(c.pali), c.id]));
	const fbf = section(S, 'Sampayoga — Factor by Factor') ?? '';
	const jhanaWise = new Set(['vicara', 'piti']); // the sheet counts these two jhāna-wise, i.e. on 121
	let rowsChecked = 0;
	for (const [names, n, where] of tableRows(fbf)) {
		if (names === 'Factor') continue;
		const ids = names === 'The 19 universal beautiful factors' ? beautifulUniversals : names.split(/,\s*/).map((x) => byName.get(norm(x)));
		check(ids.every(Boolean), `cannot map factor row "${names}"`);
		for (const id of ids.filter(Boolean)) {
			const r = jhanaWise.has(id) ? 121 : 89;
			check(reach(r, id) === Number(n), `${id} reaches ${reach(r, id)} cittas on ${r}; the sheet prints ${n}`);
			// "every count that includes all eight supramundane cittas rises by thirty-two" on 121.
			if (/8 supramundane/.test(where) && !jhanaWise.has(id))
				check(reach(121, id) === Number(n) + 32, `${id} should reach ${Number(n) + 32} on 121`);
			rowsChecked++;
		}
	}
	check(rowsChecked === factorOrder.length, `Factor by Factor rows cover ${rowsChecked} factors, expected ${factorOrder.length}`);
	check(/rises by thirty-two/.test(fbf), 'the 121 "rises by thirty-two" sentence moved');
	// Derived, not sheet figures: the site's own 89-reckoning counts for vicāra and pīti (shown as "derived").
	check(reach(89, 'vicara') === 58 && reach(89, 'piti') === 35, `derived 89 figures changed: vicāra ${reach(89, 'vicara')}, pīti ${reach(89, 'piti')}`);

	// Somanassa: "Sixty-two cittas are accompanied by somanassa" (121).
	check(/Sixty-two cittas are accompanied by somanassa/.test(S), 'somanassa sentence moved');
	check(all[121].filter((c) => c.feeling === 'somanassa').length === 62, 'expected 62 somanassa cittas on 121');

	// --- Rule quotes, each inside the section its source names.
	for (const r of rules) {
		const [file, heading] = r.source.split(' — ').map((s) => s.trim());
		const text = sheets[file];
		check(!!text, `rule ${r.id}: unknown source file ${file}`);
		if (!text) continue;
		const body = section(text, heading) ?? (() => {
			// cetasika.md headings carry a gloss after the name: "13. Middha — Torpor, tiredness".
			const h = text.split('\n').find((l) => /^#+ /.test(l) && l.replace(/^#+ /, '').startsWith(`${heading} — `));
			return h ? section(text, h.replace(/^#+ /, '')) : null;
		})();
		check(body !== null, `rule ${r.id}: no section "${heading}" in ${file}`);
		check(!!body && body.includes(r.quote), `rule ${r.id}: quote not found in ${file} — ${heading}`);
		for (const f of [...r.factors, ...(r.mentions ?? [])]) check(idx.has(f), `rule ${r.id}: unknown factor ${f}`);
	}

	// --- Presentation data that must stay in step with the sheets.
	const ids = new Set([...cittas89, ...lokuttara121].map((c) => c.id));
	for (const p of presetIds) check(ids.has(p[89]) && all[121].some((c) => c.id === p[121]), `preset ${p[89]} missing`);
	check(wheelArcs.map((a) => a.factors.length).join() === '4,3,4,2,1,19,3,2,1', 'wheel arcs no longer match the 14 + 25 split');
	check(wheelArcs.flatMap((a) => a.factors).join() === range('moha', 'pannindriya').join(), 'wheel arcs skip or repeat a factor');

	return fails;
}

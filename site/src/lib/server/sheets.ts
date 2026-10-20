import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { cetasikas } from '#lib/cetasikas';
import { renderMarkdown, sectionAfterHeading } from '#lib/markdown';
import type { TocItem } from '#lib/types';

function readRepoFile(name: string): string {
	const path = join(process.cwd(), '..', name);
	return readFileSync(path, 'utf8');
}

function escapeRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const cetasikaSheet = readRepoFile('cetasika.md');

export type SheetInfo = {
	slug: string;
	title: string;
	question: string;
	lede: string;
	html: string;
	toc: TocItem[];
};

const sources: { slug: string; title: string; question: string; lede: string; file: string }[] = [
	{
		slug: 'citta',
		title: 'Citta',
		question: 'What kind of mind-moment is this?',
		lede: 'Consciousness is the bare knowing of an object. There are 89 cittas, generated from plane, nature, association, and prompting. The alternate total is 121.',
		file: 'citta.md'
	},
	{
		slug: 'cetasikas',
		title: 'Cetasika',
		question: 'What is this moment made of?',
		lede: 'Fifty-two mental factors. Seven in every moment, six in some, fourteen unwholesome, twenty-five beautiful. This page is the sheet, as written.',
		file: 'cetasika.md'
	},
	{
		slug: 'sampayoga',
		title: 'Sampayoga',
		question: 'What can share a moment?',
		lede: 'Association and inclusion: which cittas a factor enters, which factors a citta contains, and the rules that keep some factors apart.',
		file: 'sampayoga.md'
	},
	{
		slug: 'vithi',
		title: 'Vīthi',
		question: 'When, in the sequence, did this happen?',
		lede: 'A cognitive process is a fixed sequence. Of the seventeen moments in a full sense-door process, the javanas are where kamma is made. Determining is where their character is settled.',
		file: 'vithi.md'
	}
];

function renderSource(source: (typeof sources)[number]): SheetInfo {
	const rendered = renderMarkdown(readRepoFile(source.file));
	if (rendered.html.includes('**')) {
		throw new Error(`Unparsed bold left in ${source.file}`);
	}
	if (!rendered.html.includes('<h1')) {
		throw new Error(`No title rendered for ${source.file}`);
	}
	return {
		slug: source.slug,
		title: source.title,
		question: source.question,
		lede: source.lede,
		html: rendered.html,
		toc: rendered.toc
	};
}

export const sheets: SheetInfo[] = sources.map(renderSource);

export function getSheet(slug: string): SheetInfo | undefined {
	return sheets.find((sheet) => sheet.slug === slug);
}

export function factorSection(pali: string): { id: string; heading: string; html: string } {
	const pattern = new RegExp(`^### \\d+\\. ${escapeRegExp(pali)} — .+$`, 'm');
	const section = sectionAfterHeading(cetasikaSheet, pattern);
	if (section.html.includes('**') || section.html.trim() === '') {
		throw new Error(`Bad section for ${pali}`);
	}
	return section;
}

for (const factor of cetasikas) {
	factorSection(factor.pali);
}

import { error } from '@sveltejs/kit';
import { getSheet, sheets } from '#lib/server/sheets';
import type { EntryGenerator } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => sheets.map((sheet) => ({ slug: sheet.slug }));

export function load({ params }) {
	const sheet = getSheet(params.slug);
	if (!sheet) error(404, 'No sheet by that name');
	return { sheet };
}

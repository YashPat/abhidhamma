import { error } from '@sveltejs/kit';
import { cetasikas, getCetasika } from '#lib/cetasikas';
import { factorSection } from '#lib/server/sheets';
import type { EntryGenerator } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => cetasikas.map((factor) => ({ slug: factor.id }));

export function load({ params }) {
	const factor = getCetasika(params.slug);
	if (!factor) error(404, 'No factor by that name');
	return {
		factor,
		section: factorSection(factor.pali)
	};
}

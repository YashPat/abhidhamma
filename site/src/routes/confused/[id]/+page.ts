import { error } from '@sveltejs/kit';
import { confusions, getConfusion } from '#lib/confusions';
import type { EntryGenerator, PageLoad } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => confusions.map((confusion) => ({ id: confusion.id }));

export const load: PageLoad = ({ params }) => {
	const confusion = getConfusion(params.id);
	if (!confusion) error(404, 'No mix-up by that name');
	return { confusion };
};

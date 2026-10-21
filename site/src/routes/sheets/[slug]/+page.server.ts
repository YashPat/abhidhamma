import { error } from "@sveltejs/kit";
import { getSheet, sheets } from "#lib/server/sheets";
import type { EntryGenerator, PageServerLoad } from "./$types";

export const prerender = true;

export const entries: EntryGenerator = () =>
  sheets.map((sheet) => ({ slug: sheet.slug }));

export const load: PageServerLoad = ({ params }) => {
  const found = getSheet(params.slug);
  if (!found) error(404, "No sheet by that name");
  return found;
};

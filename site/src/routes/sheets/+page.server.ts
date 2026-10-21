import { sheetLink, sheets } from "#lib/server/sheets";
import type { PageServerLoad } from "./$types";

export const prerender = true;

export const load: PageServerLoad = () => ({ sheets: sheets.map(sheetLink) });

import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			// GitHub Pages serves 404.html for unknown paths; the fallback renders the site's own error page.
			adapter: adapter({ strict: true, fallback: '404.html' }),
			preprocess: vitePreprocess(),
			paths: {
				// Set by the Pages workflow to the repository path, e.g. /abhidhamma. Empty for local dev.
				base: (process.env.BASE_PATH ?? '') as '' | `/${string}`,
				relative: false
			}
		})
	],
	server: {
		fs: {
			allow: ['..']
		}
	}
});

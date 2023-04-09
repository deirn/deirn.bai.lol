import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/kit/vite";
import preprocess from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		vitePreprocess(),
		preprocess({
			postcss: true
		})
	],

	kit: {
		adapter: adapter({
			strict: false
		}),

		prerender: {
			entries: ["*", "/404", "/test"]
		},

		typescript: {
			config(config) {
				config.exclude.push("../src/lib/vscode-theme-onelight/**");
			}
		}
	}
};

export default config;

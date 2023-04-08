import { parseMarkdown } from "$lib/markdown";
import { error } from "@sveltejs/kit";

export type Children = {
	dir: boolean;
};

export async function load({ params }) {
	const pageFiles = import.meta.glob("../../public/**/*.md", { query: "raw" });

	for (const pagePath in pageFiles) {
		if (
			pagePath == `../../public/${params.path}.md` ||
			pagePath == `../../public/${params.path}/index.md`
		) {
			const page = (await pageFiles[pagePath]()) as any;
			return {
				markdown: await parseMarkdown(page.default as string),
				path: params.path
			};
		}
	}

	throw error(404, "Not Found");
}


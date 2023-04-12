import { countLines, highlight } from "$lib/markdown.js";
import { error } from "@sveltejs/kit";

export async function load({ params }) {
	const pageFiles = import.meta.glob("../../../public/**/*.md", { query: "raw" });

	for (const pagePath in pageFiles) {
		if (
			pagePath == `../../../public/${params.path}.md` ||
			pagePath == `../../../public/${params.path}/index.md`
		) {
			const page = (await pageFiles[pagePath]()) as any;
			return {
				source: await highlight("markdown", page.default),
				loc: countLines(page.default),
				path: params.path
			};
		}
	}

	throw error(404, "Not Found");
}

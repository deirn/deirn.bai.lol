import { highlight } from "$lib/markdown.js";
import { error } from "@sveltejs/kit";

export async function load({ params }) {
	const markdown = await import(
		`../../../../../../../blog/${params.year}/${params.month}/${params.day}.${params.slug}.md?raw`
	).catch(() => null);

	if (markdown == null) {
		throw error(404, "Not Found");
	}

	return {
		source: await highlight("markdown", markdown.default),
		path: `/blog/${params.year}/${params.month}/${params.day}/${params.slug}`
	};
}

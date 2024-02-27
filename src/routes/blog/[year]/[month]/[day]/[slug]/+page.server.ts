import { error } from "@sveltejs/kit";
import frontMatter from "front-matter";
import type { BlogAttr } from "$lib/blog";
import { parseMarkdown } from "$lib/markdown.js";

export async function load({ params }) {
	const markdown = await import(
		`../../../../../../blog/${params.year}/${params.month}/${params.day}.${params.slug}.md?raw`
	).catch(() => null);

	if (markdown == null) {
		throw error(404, "Not Found");
	}

	const blog = frontMatter<BlogAttr>(markdown.default);

	return {
		body: await parseMarkdown(blog.body),
		path: `/blog/${params.year}/${params.month}/${params.day}/${params.slug}`,
		attr: blog.attributes
	};
}

import type { Blog, BlogAttr } from "$lib/blog";
import frontMatter from "front-matter";

export async function load() {
	const blogFiles = import.meta.glob("../../blog/**/*.md", { query: "raw" });

	let blogs: Blog[] = Array(Object.keys(blogFiles).length);

	let i = 0;
	let notHidden = 0;

	for (const blog in blogFiles) {
		const slashSplit = blog.replace("../../blog/", "").split("/");
		const [year, month, remainder] = slashSplit;
		const [day, slug] = remainder.split(".");

		const markdown = ((await blogFiles[blog]()) as any).default;
		const attr = frontMatter<BlogAttr>(markdown).attributes;

		const path = `/blog/${year}/${month}/${day}/${slug}`;

		blogs[i] = { path, attr };
		i++;

		if (!attr.hidden) {
			notHidden++;
		}
	}

	return {
		notHidden,
		blogs: blogs.sort((a, b) => b.attr.time.valueOf() - a.attr.time.valueOf())
	};
}

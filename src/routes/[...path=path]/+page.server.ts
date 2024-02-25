import { type MarkdownAttr, parseMarkdown } from "$lib/markdown";
import { error } from "@sveltejs/kit";
import frontMatter from "front-matter";

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
      const markdown = frontMatter<MarkdownAttr>(page.default);

      return {
        markdown: await parseMarkdown(markdown.body),
        attributes: markdown.attributes,
        path: params.path,
      };
    }
  }

  throw error(404, "Not Found");
}

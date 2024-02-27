import { type MarkdownAttr, parseMarkdown } from "$lib/markdown";
import source from "../public/index.md?raw";
import frontMatter from "front-matter";

export async function load() {
  const markdown = frontMatter<MarkdownAttr>(source);

  return {
    markdown: await parseMarkdown(markdown.body),
    attributes: markdown.attributes,
  };
}

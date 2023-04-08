import { parseMarkdown } from "$lib/markdown";
import source from "../public/index.md?raw";

export async function load() {
  return {
    markdown: parseMarkdown(source)
  }
}

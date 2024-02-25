import type { MarkdownAttr } from "./markdown";

export type Blog = {
  path: string;
  attr: BlogAttr;
};

export type BlogAttr = MarkdownAttr & {
  title: string;
  author: string;
  time: Date;
  tags: string[];
  hidden: boolean | undefined;
};

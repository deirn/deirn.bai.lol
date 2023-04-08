import { marked } from "marked";
import * as shiki from "shiki";
import oneLightJson from "./vscode-theme-onelight/themes/OneLight.json";

shiki.setCDN("/assets/shiki/");
const oneLight = shiki.toShikiTheme(oneLightJson as any);
const highlighter = shiki.getHighlighter({ theme: oneLight });

const option: marked.MarkedExtension = {
	async: true,
	gfm: true,
	renderer: {
		code(code) {
			return code;
		}
	},
	highlight(code, lang, callback) {
		highlight(lang, code)
			.then((output) => {
				callback?.(null, output);
			})
			.catch((error) => {
				callback?.(error);
			});
	}
};

export async function parseMarkdown(source: string) {
	marked.use(option);
	return new Promise<string>((resolve, reject) =>
		marked.parse(source, (err, html) => (err ? reject(err) : resolve(html)))
	);
}

export async function highlight(lang: string, code: string) {
	return (await highlighter).codeToHtml(code, { lang });
}

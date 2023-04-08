import { highlight } from "$lib/markdown";
import source from "../../public/index.md?raw";

export async function load() {
	return {
		source: await highlight("markdown", source)
	};
}

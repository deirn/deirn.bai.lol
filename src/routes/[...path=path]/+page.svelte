<script lang="ts">
	import Article from "$lib/component/Article.svelte";
	import Markdown from "$lib/component/Markdown.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<Article slug={data.path}>
	<Markdown>
		{@html data.markdown}
	</Markdown>
</Article>
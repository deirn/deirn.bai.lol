<script lang="ts">
	import Article from "$lib/component/Article.svelte";
	import Markdown from "$lib/component/Markdown.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<svelte:head>
	<title>deirn.bai.lol - /{data.path}</title>
</svelte:head>

<Article raw="/{data.path}/raw">
	<Markdown>
		{@html data.markdown}
	</Markdown>
</Article>
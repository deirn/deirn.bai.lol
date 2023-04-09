<script lang="ts">
	import Article from "$lib/component/Article.svelte";
	import Markdown from "$lib/component/Markdown.svelte";
	import dateFormat from "dateformat";
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<svelte:head>
	<title>deirn.bai.lol - {data.attr.title}</title>
</svelte:head>

<Article raw="{data.path}/raw">
	<div class="text-gray-500">
		{data.attr.author}, {dateFormat(data.attr.time, "yyyy-mm-dd HH:MM")}
	</div>

	<Markdown>
		<h1>{data.attr.title}</h1>
		{@html data.body}
	</Markdown>
</Article>

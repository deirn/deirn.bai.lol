<script lang="ts">
	import RawMarkdownViewer from "$lib/component/RawMarkdownViewer.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<RawMarkdownViewer path="/">
	{@html data.source}
</RawMarkdownViewer>

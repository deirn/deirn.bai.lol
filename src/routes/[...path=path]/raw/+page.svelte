<script lang="ts">
	import RawMarkdownViewer from "$lib/component/RawMarkdownViewer.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<RawMarkdownViewer path="/{data.path}" loc={data.loc}>
	{@html data.source}
</RawMarkdownViewer>

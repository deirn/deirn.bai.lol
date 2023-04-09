<script lang="ts">
	import Link from "$lib/component/Link.svelte";
	import dateFormat from "dateformat";
	import type { PageData } from "./$types";
	import { page } from "$app/stores";
	import { onMount } from "svelte";

	export let data: PageData;

	let showHidden = false;
	onMount(() => {
		showHidden = $page.url.searchParams.has("hidden")
	})
</script>

<div class="flex flex-col">	
	{#each data.blogs as { path, attr }}
		<div class="mb-4 last:mb-0" class:hidden={attr.hidden && !showHidden}>
			<Link href={path}>
				<div class="flex flex-col">
					<!-- <div class="text-gray-500">{attr.tags.join(", ")}</div> -->
					<div class="text-2xl font-bold">{attr.title}</div>
					<div class="text-gray-500">
						{attr.author}, {dateFormat(attr.time, "yyyy-mm-dd HH:MM")}
					</div>
				</div>
			</Link>
		</div>
	{/each}

	{#if (!showHidden && data.notHidden == 0) || (showHidden && data.blogs.length != 0)}
		<div class="text-2xl font-bold">TODO: Write some blog.</div>
	{/if}
</div>

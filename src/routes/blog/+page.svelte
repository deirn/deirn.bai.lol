<script lang="ts">
	import Link from "$lib/component/Link.svelte";
	import dateFormat from "dateformat";
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<div class="flex flex-col">	
	{#each data.blogs as { path, attr }}
		<div class="mb-4 last:mb-0" class:hidden={attr.hidden}>
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

	{#if data.notHidden == 0}
		<div class="text-2xl font-bold">TODO: Write some blog.</div>
	{/if}
</div>

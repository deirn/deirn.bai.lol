<script lang="ts">
	import Link from "$lib/component/Link.svelte";

	export let path: string;
	export let loc: number;
</script>

<svelte:head>
	<title>deirn.bai.lol - raw("{path}")</title>
</svelte:head>

<div class="flex flex-col gap-4">
	<div class="markdown-raw flex overflow-scroll">
		<div class="scroller flex grow min-h-full h-fit">
			<div class="text-right bg-gray-200 text-[#a0a1a7] py-2 px-[1ch] sticky left-0">
				{#each { length: loc } as _, i}
					{i + 1}<br />
				{/each}
			</div>
			<slot />
		</div>
	</div>

	<div class="flex flex-row-reverse">
		<Link href={path}>show rendered markdown</Link>
	</div>
</div>

<style lang="scss" global="true">
	.markdown-raw {
		height: calc(100vh - (1.5rem + 2rem + 3rem));

		pre.shiki {
			@apply grow;

			> code {
				@apply block my-2 mx-[1ch];
			}
		}
	}
</style>

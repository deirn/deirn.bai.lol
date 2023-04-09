<script lang="ts">
	import Link from "$lib/component/Link.svelte";

	export let path: string;
	export let loc: number;
</script>

<svelte:head>
	<title>deirn.bai.lol - raw("{path}")</title>
</svelte:head>

<div class="flex flex-col gap-4">
	<div class="markdown-raw" style="--padding: {`${loc}`.length}ch;">
		<slot />
	</div>

	<div class="flex flex-row-reverse">
		<Link href={path}>show rendered markdown</Link>
	</div>
</div>

<style lang="scss" global="true">
	.markdown-raw > pre > code {
		@apply block w-full px-[1ch] py-2 overflow-auto overflow-y-scroll;
		counter-reset: line 0;
		height: calc(100vh - (1.5rem + 2rem + 3rem));

		span.line {
			counter-increment: line;
			&::before {
				content: counter(line);
				@apply inline-block text-right mr-[2ch] text-gray-400;
				width: var(--padding);
			}
		}
	}
</style>

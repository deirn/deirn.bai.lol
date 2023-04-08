<script lang="ts">
	import Link from "$lib/component/Link.svelte";
	import { onMount } from "svelte";

	export let path: string;

	onMount(() => {
		const code = document.querySelector<HTMLElement>(".markdown-raw>pre>code")!!;
		code.style.setProperty("--padding", `${code.children.length}`.length + "ch");
	});
</script>

<svelte:head>
	<title>deirn.bai.lol - raw("{path}")</title>
</svelte:head>

<div class="flex flex-col gap-4">
	<div class="markdown-raw">
		<slot />
	</div>

	<div class="flex flex-row-reverse">
		<Link href={path}>show rendered markdown</Link>
	</div>
</div>

<style lang="scss" global="true">
	.markdown-raw > pre > code {
		--padding: 3ch;

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

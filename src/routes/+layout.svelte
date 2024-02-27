<script lang="ts">
	import Link from "$lib/component/Link.svelte";
	import "../app.scss";
	import type { LayoutData } from "./$types";

	export let data: LayoutData;
</script>

<svelte:head>
	<title>deirn.bai.lol - {data.route.id}</title>
</svelte:head>

<div class="mx-auto flex min-h-screen max-w-5xl flex-col p-3 gap-4 relative">
	<div class="flex gap-[1ch] bg-[#eee7ea]">
		<Link href="/" cls="bg-deirn text-white">deirn.bai.lol</Link>
		<div class="grow" />
		<Link href="/blog">blog</Link>
		<Link href="/projects">projects</Link>
		<Link href="/tools">tools</Link>
	</div>

	<div class="flex flex-col grow">
		<slot />
	</div>
</div>

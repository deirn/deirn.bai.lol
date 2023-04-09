<script lang="ts">
	import Link from "./Link.svelte";

	export let raw: string;
</script>

<div class="flex flex-col gap-4 grow">
	<div class="grow">
		<slot />
	</div>

	<div class="flex flex-row-reverse">
		<Link href={raw}>show raw markdown</Link>
	</div>
</div>

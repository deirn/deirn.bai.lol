<script lang="ts">
	export let href: string;
	export let cls = "bg-indigo-200 visited:bg-purple-200";
</script>

<a {href}>
	<div class={cls}>
		<slot />
	</div>
</a>

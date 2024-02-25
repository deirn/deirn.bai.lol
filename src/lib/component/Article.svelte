<script lang="ts">
  import Link from "./Link.svelte";

  export let raw: string;
  export let hideRaw: boolean = false;
</script>

<div class="flex flex-col gap-4 grow">
  <div class="flex flex-col grow">
    <slot />
  </div>

  {#if !hideRaw}
    <div class="flex flex-row-reverse">
      <Link href={raw}>show raw markdown</Link>
    </div>
  {/if}
</div>

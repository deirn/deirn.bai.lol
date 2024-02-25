<script lang="ts">
  import Article from "$lib/component/Article.svelte";
  import Markdown from "$lib/component/Markdown.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<Article raw="/raw" hideRaw={data.attributes.hideRawText ?? false}>
  <Markdown>
    {@html data.markdown}
  </Markdown>
</Article>

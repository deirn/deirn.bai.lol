<script lang="ts">
  import Article from "$lib/component/Article.svelte";
  import Markdown from "$lib/component/Markdown.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<Article raw="/raw" hideRaw={data.attributes.hideRawText ?? false}>
  <Markdown>
    <div class="relative z-10 !-my-4">
      {@html data.markdown}
    </div>
  </Markdown>

  <div class="w-full absolute bottom-0 left-0 right-0">
    <div class="relative w-full">
      <img src="/assets/img/kessoku.svg" alt="kessoku" class="w-full" />
      <a
        href="https://github.com/deirn/deirn.bai.lol"
        class="absolute w-[7%] h-[12%] top-[17%] right-[35%]"
        ><span />
      </a>
    </div>
  </div>
</Article>

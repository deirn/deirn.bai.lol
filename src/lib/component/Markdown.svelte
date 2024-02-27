<script lang="ts">
	export let grow = true;
</script>

<div class="markdown" class:grow={grow}>
	<slot />
</div>

<style lang="scss" global="true">
	.markdown {
		h1 {
			@apply my-4 pb-1 text-5xl font-bold border-b-2 border-black;
		}

		h2 {
			@apply my-4 pb-1 text-3xl font-bold border-b-2 border-black;
		}

		h3 {
			@apply my-4 text-xl font-bold;
		}

		hr {
			@apply border border-black;
		}

		a {
			@apply bg-indigo-200 visited:bg-purple-200;
		}

		p,
		ul,
		ol,
		blockquote,
		pre {
			@apply mb-4;
		}

		> *:first-child {
			@apply mt-0;
		}

		> *:last-child {
			@apply mb-0;
		}

		blockquote {
			@apply py-1 pl-[calc(2ch-4px)] pr-1 border-l-4 border-[#e99fbe] bg-[#f0cfdd];

			*:first-child {
				@apply mt-0;
			}

			*:last-child {
				@apply mb-0;
			}
		}

		ul {
			li {
				margin-left: 6ch;
				&::marker {
					content: "*\a0\a0";
				}
			}
		}

		ol {
			list-style-type: decimal;
			li {
				margin-left: 6ch;
			}
		}

		code {
			@apply px-[1ch] bg-[#fafafa];
			font-family: "JetBrains Mono", monospace;
		}

		pre > code {
			@apply block w-full py-2 overflow-auto;
		}
	}
</style>

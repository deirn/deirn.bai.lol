<script lang="ts">
  import Markdown from "$lib/component/Markdown.svelte";
  import { LogicSymbols, solveExpression } from "$lib/tool/truth";
  import type { MouseEventHandler } from "svelte/elements";
  import { onMount } from "svelte";

  let expression: HTMLInputElement;
  let tableContainer: HTMLDivElement;

  const push: MouseEventHandler<HTMLButtonElement> = (e) => {
    expression.value += e.currentTarget.innerText;
    expression.focus();
  };

  function reset() {
    expression.value = "";
    tableContainer.innerHTML = "";
    expression.focus();
  }

  function generate() {
    const exp = expression.value.trim();
    const result = solveExpression(exp);

    if (result.success) {
      const table = document.createElement("table");
      const head = table.createTHead().insertRow();
      const body = table.createTBody();

      for (const [expression, values] of result.val) {
        head.insertCell().innerText = expression;

        for (let i = 0; i < values.length; i++) {
          if (body.rows.length <= i) body.insertRow();

          const value = values[i];
          const cell = body.rows[i].insertCell();
          cell.innerText = value ? "T" : "F";
          cell.classList.add(value ? "true" : "false");
        }
      }

      tableContainer.innerHTML = "";
      tableContainer.append(table);
      localStorage.setItem("truth/expression", exp);
    } else {
      console.log(result.error);
    }
  }

  onMount(() => {
    const history = localStorage.getItem("truth/expression");

    if (history !== null && history !== "") {
      expression.value = history;
      generate();
    }
  });
</script>

<Markdown>
  <h1>Truth Table Generator</h1>

  <p>This tool generates truth tables for logical formulas.</p>

  <p>
    Implication and Bi-implication doesn't work properly, you need to wrap it with brackets. <br />
    That's a problem for future me.
  </p>
</Markdown>

<input
  type="text"
  name="expression"
  id="expression-2"
  class="text-2xl font-bold font-math text-center my-4 bg-white"
  bind:this={expression}
/>

<div class="flex flex-col gap-2">
  <div class="flex gap-2">
    <div class="grow" />
    <button class="w-10" on:click={push}>{LogicSymbols.LEFT_BRACKET}</button>
    <button class="w-10" on:click={push}>{LogicSymbols.RIGHT_BRACKET}</button>

    <button class="w-10" on:click={push}>{LogicSymbols.NOT}</button>
    <button class="w-10" on:click={push}>{LogicSymbols.AND}</button>
    <button class="w-10" on:click={push}>{LogicSymbols.OR}</button>
    <button class="w-10" on:click={push}>{LogicSymbols.IMPLICATION}</button>
    <button class="w-10" on:click={push}>{LogicSymbols.BIIMPLICATION}</button>
    <div class="grow" />
  </div>

  <div class="flex gap-2">
    <div class="grow" />
    <button class="bg-green-300" on:click={generate}>Generate</button>
    <button class="bg-red-300" on:click={reset}>Reset</button>
    <div class="grow" />
  </div>
</div>

<div class="flex mt-4 overflow-x-auto">
  <div class="grow" />
  <div id="table-container" bind:this={tableContainer} />
  <div class="grow" />
</div>

<style lang="scss" global="true">
  #table-container table {
    @apply border-collapse;

    thead {
      @apply font-math bg-gray-300;
    }

    td {
      @apply px-2 py-1 border border-black text-center;

      &.true {
        @apply bg-green-300;
      }

      &.false {
        @apply bg-red-300;
      }
    }
  }
</style>

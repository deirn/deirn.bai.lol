<script lang="ts">
  import Markdown from "$lib/component/Markdown.svelte";
  import { LogicSymbols, solveExpression } from "$lib/tool/truth";
  import type { MouseEventHandler } from "svelte/elements";
  import { onMount } from "svelte";

  let expression: HTMLInputElement;
  let errorContainer: HTMLDivElement;
  let tableContainer: HTMLDivElement;

  const push: MouseEventHandler<HTMLButtonElement> = (e) => {
    expression.value += e.currentTarget.innerText;
    expression.focus();
  };

  function resetOutput() {
    errorContainer.innerHTML = "";
    tableContainer.innerHTML = "";
    errorContainer.classList.add("hidden");
  }

  function reset() {
    resetOutput();
    expression.value = "";
    expression.focus();
  }

  function generate() {
    resetOutput();

    const exp = expression.value.trim();
    const result = solveExpression(exp);

    if (result.left) {
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

      tableContainer.append(table);
      localStorage.setItem("truth/expression", exp);
    } else {
      const { pos, msg } = result.val;

      const errExp = document.createElement("div");

      errExp.classList.add("expression");

      const before = exp.substring(0, pos - 1);
      errExp.appendChild(document.createTextNode(before));

      const error = document.createElement("span");
      error.classList.add("error");
      error.innerText = exp[pos - 1];
      errExp.appendChild(error);

      const after = exp.substring(pos, exp.length);
      errExp.appendChild(document.createTextNode(after));

      errorContainer.appendChild(errExp);

      const errMsg = document.createElement("div");
      errMsg.innerText = msg;
      errorContainer.appendChild(errMsg);

      errorContainer.classList.remove("hidden");
      expression.focus();
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
  id="expression"
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

<div class="flex">
  <div class="flex-grow" />
  <div
    class="mt-4 px-2 py-1 hidden text-xs text-center"
    id="error-container"
    bind:this={errorContainer}
  />
  <div class="flex-grow" />
</div>

<div class="flex mt-4 overflow-x-auto">
  <div class="grow" />
  <div id="table-container" bind:this={tableContainer} />
  <div class="grow" />
</div>

<style lang="scss" global="true">
  #error-container {
    .expression {
      @apply font-math text-2xl;

      .error {
        @apply text-red-500 font-bold;
      }
    }
  }

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

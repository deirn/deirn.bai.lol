<script lang="ts">
  import { page } from "$app/stores";
  import Markdown from "$lib/component/Markdown.svelte";
  import { SetSymbols, solveExpression } from "$lib/tool/set";
  import { onMount } from "svelte";
  import type { MouseEventHandler } from "svelte/elements";

  let universeInput: HTMLInputElement;
  let expression: HTMLInputElement;
  let errorContainer: HTMLDivElement;
  let resultContainer: HTMLDivElement;

  let setValues: [string, string][] = [["", ""]];

  function addSet() {
    setValues.push(["", ""]);
    setValues = setValues;
  }

  const push: MouseEventHandler<HTMLButtonElement> = (e) => {
    const { value, selectionStart } = expression;
    const before = value.slice(0, selectionStart ?? value.length);
    const after = value.slice(before.length);

    expression.value = before + e.currentTarget.innerText + after;
    expression.focus();

    if (selectionStart !== null) {
      expression.setSelectionRange(selectionStart + 1, selectionStart + 1);
    }
  };

  function resetOutput() {
    resultContainer.innerHTML = "";
    errorContainer.innerHTML = "";
    errorContainer.classList.add("hidden");
  }

  function reset() {
    resetOutput();
    expression.value = "";
    expression.focus();
  }

  function solve() {
    resetOutput();

    const universe = universeInput.value.trim();
    const exp = expression.value.trim();

    const sets = new Map<string, string>();
    sets.set("U", universe);

    for (const [name, value] of setValues) {
      if (name.trim() == "") continue;
      sets.set(name.trim(), value.trim());
    }

    const result = solveExpression(sets, exp);

    if (result.success) {
      result.val.forEach((value, key) => {
        const div = document.createElement("div");
        div.innerText = `${key} = \{${Array.from(value).join(", ")}\}`;
        resultContainer.appendChild(div);
      });

      const setsJson = JSON.stringify(Object.fromEntries(sets.entries()));
      localStorage.setItem("set/expression", exp);
      localStorage.setItem("set/sets", setsJson);
      $page.url.searchParams.set("e", encodeURIComponent(exp));
      $page.url.searchParams.set("s", setsJson);
      window.history.replaceState({ path: $page.url.toString() }, "", $page.url);
    } else {
      const { pos, msg } = result.error;

      const errExp = document.createElement("div");

      errExp.classList.add("expression");

      const before = exp.substring(0, pos - 1);
      errExp.appendChild(document.createTextNode(before));

      if (pos >= 0) {
        const error = document.createElement("span");
        error.classList.add("error");
        error.innerText = exp[pos - 1];
        errExp.appendChild(error);
      }

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

  function setSets(obj: any) {
    if (obj["U"] === undefined) return;
    const keys = Object.keys(obj);

    universeInput.value = obj["U"];
    setValues = [];

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (key === "U") continue;

      setValues.push([key, obj[key]]);
    }
  }

  onMount(() => {
    const expressionQuery = $page.url.searchParams.get("e");
    const setQueries = $page.url.searchParams.get("s");

    const expressionHistory = localStorage.getItem("set/expression");
    const setHistories = localStorage.getItem("set/sets");

    if (expressionQuery && setQueries) {
      expression.value = decodeURIComponent(expressionQuery);
      setSets(JSON.parse(setQueries));
      solve();
    } else if (expressionHistory && setHistories) {
      expression.value = expressionHistory;
      setSets(JSON.parse(setHistories));
      solve();
    }
  });
</script>

<Markdown>
  <h1>Set Operators Solver</h1>

  <noscript>
    <p><b>This page requires JavaScript to be enabled, duh.</b></p>
  </noscript>

  <p>This tool solves operations of finite sets.</p>
</Markdown>

<div id="set-inputs" class="my-2 flex flex-col gap-2">
  <div class="flex gap-2">
    <input
      type="text"
      name="set-name-universe"
      id="set-name-universe"
      placeholder="Set name"
      value="U"
      disabled
      class="text-2xl font-bold font-math text-center bg-white w-32"
    />
    <input
      type="text"
      name="set-universe"
      id="set-universe"
      placeholder="Universe Value"
      class="text-2xl font-bold font-math text-center bg-white grow"
      bind:this={universeInput}
    />
  </div>
  {#each setValues as _, index}
    <div class="flex gap-2">
      <input
        type="text"
        name="set-name-{index}"
        id="set-name-{index}"
        placeholder="Set name"
        class="text-2xl font-bold font-math text-center bg-white w-32"
        bind:value={setValues[index][0]}
      />
      <input
        type="text"
        name="set-{index}"
        id="set-{index}"
        placeholder="Value"
        class="text-2xl font-bold font-math text-center bg-white grow"
        bind:value={setValues[index][1]}
      />
    </div>
  {/each}
</div>

<div class="flex">
  <div class="grow" />
  <button on:click={addSet}>Add Set</button>
  <div class="grow" />
</div>

<input
  type="text"
  name="expression"
  id="expression"
  placeholder="Expression"
  class="text-2xl font-bold font-math text-center my-4 bg-white"
  bind:this={expression}
/>

<div class="flex flex-col gap-2">
  <div class="flex gap-2">
    <div class="grow" />
    <button class="w-10" on:click={push}>{"("}</button>
    <button class="w-10" on:click={push}>{")"}</button>

    <button class="w-10" on:click={push}>{SetSymbols.COMPLEMENT}</button>
    <button class="w-10" on:click={push}>{SetSymbols.UNION}</button>
    <button class="w-10" on:click={push}>{SetSymbols.INTERSECTION}</button>
    <button class="w-10" on:click={push}>{SetSymbols.DIFFERENCE}</button>
    <button class="w-10" on:click={push}>{SetSymbols.SYMMETRIC_DIFFERENCE}</button>
    <button class="w-10" on:click={push}>{SetSymbols.PRODUCT}</button>
    <div class="grow" />
  </div>

  <div class="flex gap-2">
    <div class="grow" />
    <button class="bg-green-300" on:click={solve}>Solve</button>
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

<div
  id="result-container"
  class="flex flex-col gap-2 mt-4 text-2xl font-math"
  bind:this={resultContainer}
/>

<style lang="scss" global="true">
  #error-container {
    .expression {
      @apply font-math text-2xl;

      .error {
        @apply text-red-500 font-bold;
      }
    }
  }
</style>

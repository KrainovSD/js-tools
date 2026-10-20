<script setup lang="ts">
  import { languages } from "@codemirror/language-data";
  import { vsCodeDark } from "@fsegurai/codemirror-theme-vscode-dark";
  import { vsCodeLight } from "@fsegurai/codemirror-theme-vscode-light";
  import type { MarkdownOptions } from "@krainovsd/editor";
  import { onMounted, onUnmounted, ref } from "vue";
  import { VButton, VEditor } from "../ui";

  const readonly = ref(false);
  const theme = ref<"dark" | "light">("light");
  const value1 = ref(`*italic*  **bold** ***italic-bold*** [link](/link)

- [ ] Check
- [x] Finished Check

 - List1
 - List2

 > quote

\`\`\`ts

const number: number = 2
const string: string = "string"
const boolean: boolean = true
const array: unknown[] = [1, "string", true]
const object: Record<string, unknown> = {"2": 2}

function test(number: number): number {
  return number * 2
}

\`\`\`
`);

  const value2 = ref("");

  const markdown: MarkdownOptions = {
    languages,
    name: "markdown",
  };
  const mutationObserver = new MutationObserver((elements) => {
    const htmlTheme = (elements[0].target as HTMLElement)
      ?.getAttribute("style")
      ?.split?.(";")
      ?.find?.((rule) => rule.includes("--theme"))
      ?.split?.(":")?.[1]
      ?.replace?.(";", "")
      ?.trim?.();
    if (htmlTheme) {
      theme.value = htmlTheme as "dark" | "light";
    }
  });
  onMounted(() => {
    const element = document.body.parentElement;
    if (element) {
      mutationObserver.observe(element, { attributes: true });
    }
  });
  onUnmounted(() => {
    mutationObserver.disconnect();
  });
</script>

<template>
  <VButton @click="readonly = !readonly">Change readonly</VButton>
  <div :class="$style.group">
    <VEditor
      v-model="value1"
      placeholder="outlined"
      :theme="vsCodeDark"
      :readonly="readonly"
      :language="markdown"
      :font="'Nunito'"
      :font-code="'Firacode'"
    />
  </div>
  <div :class="$style.group">
    <VEditor
      v-model="value2"
      placeholder="filled"
      variant="filled"
      :theme="vsCodeLight"
      :readonly="readonly"
      :language="markdown"
      :font="'Nunito'"
      :font-code="'Firacode'"
    />
  </div>
</template>

<style lang="scss" module>
  .group {
    display: flex;
    flex-direction: column;
    gap: var(--ksd-padding-xs);
    max-height: 500px;
    flex: 1;
  }
</style>

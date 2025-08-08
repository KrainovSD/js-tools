<script setup lang="ts">
  import { languages } from "@codemirror/language-data";
  import type { EditorTheme } from "@krainovsd/markdown-editor";
  import { onMounted, onUnmounted, ref } from "vue";
  import { VButton, VMarkdownEditor } from "../ui";

  const readonly = ref(false);
  const theme = ref<EditorTheme>("light");
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

  const mutationObserver = new MutationObserver((elements) => {
    const htmlTheme = (elements[0].target as HTMLElement)
      ?.getAttribute("style")
      ?.split?.(";")
      ?.find?.((rule) => rule.includes("--theme"))
      ?.split?.(":")?.[1]
      ?.replace?.(";", "")
      ?.trim?.();
    if (htmlTheme) {
      theme.value = htmlTheme as EditorTheme;
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
    <VMarkdownEditor
      v-model="value1"
      placeholder="outlined"
      :theme="theme"
      :readonly="readonly"
      :languages="languages"
    />
  </div>
  <div :class="$style.group">
    <VMarkdownEditor
      v-model="value2"
      placeholder="filled"
      variant="filled"
      :theme="theme"
      :readonly="readonly"
      :languages="languages"
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

<script lang="ts">
  import Flex from "./flex.svelte";
  import styles from "./data.module.scss";
  import { untrack } from "svelte";
  import type { LinkData, NodeData } from "./types";
  import { linksStore, nodesStore } from "./store";
  import { createNewDynamicMock, customMock, d3Mock, realMock, stressMock } from "./mock";
  import type { GraphCanvasInterface } from "@/module/GraphCanvas";

  let dataArray: {
    id: number;
    label: string;
    data: Pick<GraphCanvasInterface<NodeData, LinkData>, "nodes" | "links">;
  }[] = [
    { data: d3Mock, id: 1, label: "D3 example" },
    { data: stressMock, id: 2, label: "Стресс" },
    { data: realMock, id: 3, label: "Реальный" },
    { data: customMock, id: 4, label: "Кастомный" },
    { data: createNewDynamicMock({ links: [], nodes: [] }), id: 5, label: "Динамически" },
  ];
  let selectedDataId: number = $state(1);
  let openData = $state(false);

  function allClose() {
    openData = false;
  }

  function toggleOpenData() {
    let open = openData;
    allClose();
    openData = !open;
  }

  $effect(() => {
    let close = untrack(() => allClose);

    document.addEventListener("click", close);

    return () => {
      document.removeEventListener("click", close);
    };
  });

  $effect(() => {
    selectedDataId;

    const selectedData = dataArray.find((data) => data.id === selectedDataId);
    if (selectedData) {
      untrack(() => nodesStore.set(selectedData.data.nodes));
      untrack(() => linksStore.set(selectedData.data.links));
    }
  });
</script>

<Flex
  onclick={(e) => {
    e.stopPropagation();
  }}
>
  <button class={styles.button} onclick={toggleOpenData} style="bottom: 10px; left: 10px"
    >{openData ? "Закрыть настройки данных" : "Открыть настройки данных"}</button
  >
  {#if openData}
    <Flex class={styles.settings} vertical gap={10} style="bottom: 45px; left: 10px;">
      <span>Настройки данных</span>
      <Flex vertical gap={10} class={styles.settings__container}>
        {#each dataArray as data (data.id)}
          <label>
            <input
              class={styles.input}
              type={"radio"}
              name="data"
              checked={selectedDataId === data.id}
              onchange={() => {
                selectedDataId = data.id;
              }}
            />
            {data.label}</label
          >
        {/each}
      </Flex>
    </Flex>
  {/if}
</Flex>

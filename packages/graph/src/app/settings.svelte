<script lang="ts">
  import Flex from "./flex.svelte";
  import styles from "./settings.module.scss";
  import { untrack } from "svelte";
  import type { LinkData, NodeData } from "./types";
  import {
    FORCE_SETTINGS,
    GRAPH_SETTINGS,
    LINK_SETTINGS,
    NODE_SETTINGS,
  } from "@/module/GraphCanvas/constants";
  import type { GraphSettingsInputInterface } from "@/types/controls";
  import { graphStore, linksStore, nodesStore } from "./store";
  // import { createNewDynamicMock, customMock, d3Mock, realMock, stressMock } from "../../mock";
  import {
    getForceControls,
    getGraphControls,
    getLinkControls,
    getNodeControls,
    getTextControls,
  } from "@/lib";
  import { createNewDynamicMock, customMock, d3Mock, realMock, stressMock } from "./mock";
  import type {
    ForceSettingsInterface,
    GraphCanvasInterface,
    GraphSettingsInterface,
    LinkOptionsInterface,
    NodeOptionsInterface,
  } from "@/module/GraphCanvas";

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
  let forceSettings: Partial<ForceSettingsInterface<NodeData, LinkData>> = $state.raw({
    ...FORCE_SETTINGS,
  });
  let graphSettings: Partial<GraphSettingsInterface<NodeData>> = $state({ ...GRAPH_SETTINGS });
  let nodeOptions: Partial<NodeOptionsInterface<NodeData, LinkData>> = $state({ ...NODE_SETTINGS });
  let linkOptions: Partial<LinkOptionsInterface<NodeData, LinkData>> = $state({ ...LINK_SETTINGS });

  let openForce = $state(false);
  let openGraph = $state(false);
  let openNode = $state(false);
  let openLink = $state(false);
  let openData = $state(false);

  function allClose() {
    openData = false;
    openForce = false;
    openGraph = false;
    openLink = false;
    openNode = false;
  }

  function toggleOpenForce() {
    let open = openForce;
    allClose();
    openForce = !open;
  }
  function toggleOpenGraph() {
    let open = openGraph;
    allClose();
    openGraph = !open;
  }
  function toggleOpenNode() {
    let open = openNode;
    allClose();
    openNode = !open;
  }
  function toggleOpenLink() {
    let open = openLink;
    allClose();
    openLink = !open;
  }
  function toggleOpenData() {
    let open = openData;
    allClose();
    openData = !open;
  }

  function clearForce() {
    forceSettings = { ...FORCE_SETTINGS };
  }
  function clearGraph() {
    graphSettings = { ...GRAPH_SETTINGS };
  }
  function clearNode() {
    nodeOptions = { ...NODE_SETTINGS };
  }
  function clearLink() {
    linkOptions = { ...LINK_SETTINGS };
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

  $effect(() => {
    forceSettings;

    const store = untrack(() => $graphStore);

    if (store) {
      store.changeSettings({
        forceSettings: { ...forceSettings },
      });
    }
  });
  $effect(() => {
    graphSettings;

    const store = untrack(() => $graphStore);

    if (store) {
      store.changeSettings({
        graphSettings: { ...graphSettings, showDrawTimeEveryTick: true },
      });
    }
  });
  $effect(() => {
    const store = untrack(() => $graphStore);
    const options = JSON.parse(JSON.stringify(nodeOptions));

    if (store) {
      store.changeSettings({
        nodeSettings: {
          options: (node) => {
            return options;
          },
        },
      });
    }
  });
  $effect(() => {
    const store = untrack(() => $graphStore);
    const options = JSON.parse(JSON.stringify(linkOptions));

    if (store) {
      store.changeSettings({
        linkSettings: {
          options: (link) => {
            return options;
          },
        },
      });
    }
  });
</script>

{#snippet inputs(
  inputs: GraphSettingsInputInterface<string>[],
  settings: Record<string, unknown>,
  onChange: (key: string, value: unknown) => void,
)}
  {#each inputs as input (input.id)}
    <Flex gap={5} align={"center"}>
      {#if input.type === "range"}
        <input
          class={[styles.input, styles.tooltip]}
          type={input.type}
          id={input.id}
          min={input.min}
          max={input.max}
          step={input.step}
          oninput={(event) => {
            onChange(input.id, +event.currentTarget.value);
          }}
          value={settings[input.id] ?? input.initialValue}
          data-tooltip={settings[input.id]?.toString?.()}
        />
        <span>{input.label ?? input.id}</span>
      {/if}
      {#if input.type === "checkbox"}
        <label>
          <input
            class={styles.input}
            type={input.type}
            id={input.id}
            checked={Boolean(settings[input.id] ?? input.initialValue)}
            onchange={(event) => {
              onChange(input.id, event.currentTarget.checked);
            }}
          />
          {input.label ?? input.id}</label
        >{/if}
      {#if input.type === "color"}
        <input
          class={styles.input}
          type={input.type}
          id={input.id}
          oninput={(event) => {
            onChange(input.id, event.currentTarget.value);
          }}
          value={settings[input.id] ?? input.initialValue}
        />
        <span>{input.label ?? input.id}</span>
      {/if}
    </Flex>
  {/each}
{/snippet}

<Flex
  onclick={(e) => {
    e.stopPropagation();
  }}
>
  <button class={styles.button} onclick={toggleOpenForce} style="top: 10px; left: 10px"
    >{openForce ? "Закрыть настройки физики" : "Открыть настройки физики"}</button
  >
  {#if openForce}
    <Flex class={styles.settings} vertical gap={10} style="top: 45px; left: 10px;">
      <span>Параметры физики:</span>
      <Flex vertical gap={10}>
        {@render inputs(getForceControls(), forceSettings, (key, value) => {
          forceSettings = { ...forceSettings, [key]: value };
        })}
        <button class={styles.settings__button} onclick={clearForce}>Сбросить</button>
      </Flex>
    </Flex>
  {/if}

  <button
    class={styles.button}
    onclick={toggleOpenGraph}
    style="top: 10px; left: calc(10px + 185px + 20px)"
    >{openGraph ? "Закрыть настройки отображения" : "Открыть настройки отображения"}</button
  >
  {#if openGraph}
    <Flex
      class={styles.settings}
      vertical
      gap={10}
      style="top: 45px; left: calc(10px + 185px + 20px);"
    >
      <span>Параметры отображения:</span>
      <Flex vertical gap={10}>
        {@render inputs(getGraphControls(), graphSettings, (key, value) => {
          graphSettings = { ...graphSettings, [key]: value };
        })}
        <button class={styles.settings__button} onclick={clearGraph}>Сбросить</button>
      </Flex>
    </Flex>
  {/if}

  <button
    class={styles.button}
    onclick={toggleOpenNode}
    style="top: 10px; left: calc(10px + 185px + 20px + 220px + 20px)"
    >{openNode ? "Закрыть настройки нод" : "Открыть настройки нод"}</button
  >
  {#if openNode}
    <Flex
      class={styles.settings}
      vertical
      gap={10}
      style="top: 45px; left: calc(10px + 185px + 20px + 220px + 20px);"
    >
      <span>Параметры нод:</span>
      <Flex vertical gap={10}>
        {@render inputs(getNodeControls(), nodeOptions, (key, value) => {
          nodeOptions = { ...nodeOptions, [key]: value };
        })}
        {@render inputs(getTextControls(), nodeOptions, (key, value) => {
          nodeOptions = { ...nodeOptions, [key]: value };
        })}
        <button class={styles.settings__button} onclick={clearNode}>Сбросить</button>
      </Flex>
    </Flex>
  {/if}

  <button
    class={styles.button}
    onclick={toggleOpenLink}
    style="top: 10px; left: calc(10px + 185px + 20px + 220px + 20px + 161px + 20px)"
    >{openLink ? "Закрыть настройки связей" : "Открыть настройки связей"}</button
  >
  {#if openLink}
    <Flex
      class={styles.settings}
      vertical
      gap={10}
      style="top: 45px; left: calc(10px + 185px + 20px + 220px + 20px + 161px + 20px);"
    >
      <span>Параметры связей:</span>
      <Flex vertical gap={10}>
        {@render inputs(getLinkControls(), linkOptions, (key, value) => {
          linkOptions = { ...linkOptions, [key]: value };
        })}
        <button class={styles.settings__button} onclick={clearLink}>Сбросить</button>
      </Flex>
    </Flex>
  {/if}

  <button class={styles.button} onclick={toggleOpenData} style="bottom: 10px; left: 10px"
    >{openData ? "Закрыть настройки данных" : "Открыть настройки данных"}</button
  >
  {#if openData}
    <Flex class={styles.settings} vertical gap={10} style="bottom: 45px; left: 10px;">
      <span>Настройки данных</span>
      <Flex vertical gap={10}>
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

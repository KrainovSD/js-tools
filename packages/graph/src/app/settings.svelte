<script lang="ts">
  import Flex from "./flex.svelte";
  import styles from "./settings.module.scss";
  import { untrack } from "svelte";
  import type { LinkData, NodeData } from "./types";
  import {
    FORCE_SETTINGS,
    GRAPH_SETTINGS,
    HIGHLIGHT_SETTINGS,
    LINK_OPTIONS,
    LINK_SETTINGS,
    NODE_OPTIONS,
    NODE_SETTINGS,
  } from "@/module/GraphCanvas/constants";
  import type { GraphSettingsInputInterface } from "@/types/controls";
  import { graphStore } from "./store";
  // import { createNewDynamicMock, customMock, d3Mock, realMock, stressMock } from "../../mock";
  import {
    FORCE_CONTROLS,
    GRAPH_CONTROLS,
    HIGHLIGHT_BY_LINK_FOR_ARROW_CONTROLS,
    HIGHLIGHT_BY_LINK_FOR_LABEL_CONTROLS,
    HIGHLIGHT_BY_LINK_FOR_LINK_CONTROLS,
    HIGHLIGHT_BY_LINK_FOR_NODE_CONTROLS,
    HIGHLIGHT_BY_LINK_FOR_TEXT_CONTROLS,
    HIGHLIGHT_BY_NODE_FOR_ARROW_CONTROLS,
    HIGHLIGHT_BY_NODE_FOR_LABEL_CONTROLS,
    HIGHLIGHT_BY_NODE_FOR_LINK_CONTROLS,
    HIGHLIGHT_BY_NODE_FOR_NODE_CONTROLS,
    HIGHLIGHT_BY_NODE_FOR_TEXT_CONTROLS,
    HIGHLIGHT_COMMON_CONTROLS,
    LINK_OPTIONS_ARROW_CONTROLS,
    LINK_OPTIONS_LINK_CONTROLS,
    LINK_OPTIONS_PARTICLE_CONTROLS,
    LINK_SETTINGS_CONTROLS,
    NODE_OPTIONS_LABEL_CONTROLS,
    NODE_OPTIONS_NODE_CONTROLS,
    NODE_OPTIONS_TEXT_CONTROLS,
    NODE_SETTINGS_CONTROLS,
  } from "@/constants";
  import type {
    ForceSettingsInterface,
    GraphSettingsInterface,
    HighlightSettingsInterface,
    LinkInterface,
    LinkOptionsInterface,
    LinkSettingsInterface,
    NodeInterface,
    NodeOptionsInterface,
    NodeSettingsInterface,
  } from "@/module/GraphCanvas";
  import { downloadJson, isArray, isObject, jsonParse, readFile } from "@krainovsd/js-helpers";
  import { getLinkSettings, getNodeNeighbors, getNodeSettings } from "./lib";

  type GraphInterface = {
    nodes: NodeInterface<NodeData>[];
    links: LinkInterface<NodeData, LinkData>[];
  };

  let forceSettings: Partial<ForceSettingsInterface<NodeData, LinkData>> = $state.raw({
    ...FORCE_SETTINGS,
  });
  let graphSettings: Partial<GraphSettingsInterface<NodeData>> = $state({ ...GRAPH_SETTINGS });
  let nodeOptions: Partial<NodeOptionsInterface<NodeData, LinkData>> = $state({ ...NODE_OPTIONS });
  let linkOptions: Partial<LinkOptionsInterface<NodeData, LinkData>> = $state({ ...LINK_OPTIONS });
  let nodeSettings: Partial<
    Omit<NodeSettingsInterface<NodeData, LinkData>, "options" | "idGetter">
  > = $state({ ...NODE_SETTINGS });
  let linkSettings: Partial<Omit<LinkSettingsInterface<NodeData, LinkData>, "options">> = $state({
    ...LINK_SETTINGS,
  });
  let highlightSettings: Partial<HighlightSettingsInterface> = $state({ ...HIGHLIGHT_SETTINGS });
  let downloadInputRef: HTMLInputElement | undefined = $state();

  let openForce = $state(false);
  let openGraph = $state(false);
  let openNode = $state(false);
  let openLink = $state(false);
  let openHighlight = $state(false);

  function allClose() {
    openForce = false;
    openGraph = false;
    openLink = false;
    openNode = false;
    openHighlight = false;
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
  function toggleOpenHighlight() {
    let open = openHighlight;
    allClose();
    openHighlight = !open;
  }

  function clearForce() {
    forceSettings = { ...FORCE_SETTINGS };
  }
  function clearGraph() {
    graphSettings = { ...GRAPH_SETTINGS };
  }
  function clearNode() {
    nodeOptions = { ...NODE_OPTIONS };
    nodeSettings = { ...NODE_SETTINGS };
  }
  function clearLink() {
    linkOptions = { ...LINK_OPTIONS };
    linkSettings = { ...LINK_SETTINGS };
  }
  function clearHighlight() {
    highlightSettings = { ...HIGHLIGHT_SETTINGS };
  }

  function exportGraph() {
    function getRequiredNodeDataProjection() {
      const { links, nodes } = $graphStore?.getData?.() ?? {};
      const graph: GraphInterface = {
        links:
          links?.map?.((link) => ({
            source: isObject(link.source)
              ? (link.source.id as string | number)
              : (link.source as string | number),
            target: isObject(link.target)
              ? (link.target.id as string | number)
              : (link.target as string | number),
            data: link.data,
          })) ?? [],
        nodes:
          nodes?.map?.((node) => ({
            id: node.id,
            data: node.data,
            name: node.name,
            vx: node.vx,
            vy: node.vy,
            x: node.x,
            y: node.y,
            group: node.group,
          })) ?? [],
      };
      return { links: graph.links, nodes: graph.nodes };
    }

    const { links, nodes } = getRequiredNodeDataProjection();
    downloadJson(
      {
        links,
        nodes,
        settings: {
          forceSettings,
          graphSettings,
          nodeOptions,
          linkOptions,
          nodeSettings,
          linkSettings,
        },
      },
      "graph.json",
    );
  }

  function importGraph() {
    downloadInputRef?.click?.();
  }

  async function onImportGraph(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.[0]) return;

    const file = await readFile(input.files[0]);
    if (!file) return;

    const json = jsonParse<GraphInterface>(file);
    if (!json || !isArray(json.links) || !isArray(json.nodes)) {
      alert("Не правильная схема данных!");
      return;
    }
    getNodeNeighbors(json);
    $graphStore?.changeData?.({ links: json.links, nodes: json.nodes });
  }

  /** button close handlers */
  $effect(() => {
    let close = untrack(() => allClose);

    document.addEventListener("click", close);

    return () => {
      document.removeEventListener("click", close);
    };
  });

  /** force settings */
  $effect(() => {
    forceSettings;

    const store = untrack(() => $graphStore);

    if (store) {
      store.changeSettings({
        forceSettings: { ...forceSettings },
      });
    }
  });
  /** graph settings */
  $effect(() => {
    graphSettings;

    const store = untrack(() => $graphStore);

    if (store) {
      store.changeSettings({
        graphSettings: { ...graphSettings, showDrawTimeEveryTick: false },
      });
    }
  });
  /** node settings */
  $effect(() => {
    const store = untrack(() => $graphStore);
    const options = JSON.parse(JSON.stringify(nodeOptions));

    if (store) {
      store.changeSettings({
        nodeSettings: {
          ...nodeSettings,
          options: getNodeSettings(options),
        },
      });
    }
  });
  /** link settings */
  $effect(() => {
    const store = untrack(() => $graphStore);
    const options = JSON.parse(JSON.stringify(linkOptions));

    if (store) {
      store.changeSettings({
        linkSettings: {
          ...linkSettings,
          options: getLinkSettings(options),
        },
      });
    }
  });
  /** highlight settings */
  $effect(() => {
    const store = untrack(() => $graphStore);

    if (store) {
      store.changeSettings({
        highlightSettings,
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
      {#if input.type === "select"}
        <select
          id="colors"
          name="colors"
          value={input.initialValue}
          onchange={(event) => onChange(input.id, event.currentTarget.value)}
        >
          {#each input.options as option (option.value)}
            <option value={option.value}>{option.label}</option>
          {/each}
        </select>
        <span>{input.label ?? input.id}</span>
      {/if}
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
          data-tooltip={settings[input.id]?.toString?.() ?? input.initialValue.toString()}
        />
        <span>{`${input.label ?? input.id} (${settings[input.id] ?? input.initialValue})`}</span>
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

<input type="file" class={styles.download} bind:this={downloadInputRef} onchange={onImportGraph} />

<Flex
  onclick={(e) => {
    e.stopPropagation();
  }}
  gap={20}
>
  <button class={styles.button} onclick={toggleOpenForce} style="top: 10px; left: 10px"
    >{openForce ? "Закрыть настройки физики" : "Открыть настройки физики"}</button
  >
  {#if openForce}
    <Flex class={styles.settings} gap={20} vertical style="top: 45px; left: 10px;">
      <h1>Параметры физики:</h1>
      <Flex vertical gap={10} class={styles.settings__container}>
        {@render inputs(FORCE_CONTROLS, forceSettings, (key, value) => {
          forceSettings = { ...forceSettings, [key]: value };
        })}
      </Flex>
      <button class={styles.settings__button} onclick={clearForce}>Сбросить</button>
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
      gap={20}
      vertical
      style="top: 45px; left: calc(10px + 185px + 20px);"
    >
      <h1>Параметры отображения:</h1>
      <Flex vertical gap={10} class={styles.settings__container}>
        {@render inputs(GRAPH_CONTROLS, graphSettings, (key, value) => {
          graphSettings = { ...graphSettings, [key]: value };
        })}
      </Flex>
      <button class={styles.settings__button} onclick={clearGraph}>Сбросить</button>
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
      gap={20}
      style="top: 45px; left: calc(10px + 185px + 20px + 220px + 20px);"
    >
      <h1>Общие параметры вершин:</h1>
      <Flex vertical gap={10} class={styles.settings__container}>
        {@render inputs(NODE_SETTINGS_CONTROLS, nodeSettings, (key, value) => {
          nodeSettings = { ...nodeSettings, [key]: value };
        })}
      </Flex>
      <h1>Параметры вершины:</h1>
      <Flex vertical gap={10} class={styles.settings__container}>
        {@render inputs(NODE_OPTIONS_NODE_CONTROLS, nodeOptions, (key, value) => {
          nodeOptions = { ...nodeOptions, [key]: value };
        })}
      </Flex>
      <h1>Параметры текста:</h1>
      <Flex vertical gap={10} class={styles.settings__container}>
        {@render inputs(NODE_OPTIONS_TEXT_CONTROLS, nodeOptions, (key, value) => {
          nodeOptions = { ...nodeOptions, [key]: value };
        })}
      </Flex>
      <h1>Параметры подписи:</h1>
      <Flex vertical gap={10} class={styles.settings__container}>
        {@render inputs(NODE_OPTIONS_LABEL_CONTROLS, nodeOptions, (key, value) => {
          nodeOptions = { ...nodeOptions, [key]: value };
        })}
      </Flex>
      <button class={styles.settings__button} onclick={clearNode}>Сбросить</button>
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
      gap={20}
      style="top: 45px; left: calc(10px + 185px + 20px + 220px + 20px + 161px + 20px);"
    >
      <h1>Общие параметры связей:</h1>
      <Flex vertical gap={10} class={styles.settings__container}>
        {@render inputs(LINK_SETTINGS_CONTROLS, linkSettings, (key, value) => {
          linkSettings = { ...linkSettings, [key]: value };
        })}
      </Flex>
      <h1>Параметры связи:</h1>
      <Flex vertical gap={10} class={styles.settings__container}>
        {@render inputs(LINK_OPTIONS_LINK_CONTROLS, linkOptions, (key, value) => {
          linkOptions = { ...linkOptions, [key]: value };
        })}
      </Flex>
      <h1>Параметры стрелки:</h1>
      <Flex vertical gap={10} class={styles.settings__container}>
        {@render inputs(LINK_OPTIONS_ARROW_CONTROLS, linkOptions, (key, value) => {
          linkOptions = { ...linkOptions, [key]: value };
        })}
      </Flex>
      <h1>Параметры частицы:</h1>
      <Flex vertical gap={10} class={styles.settings__container}>
        {@render inputs(LINK_OPTIONS_PARTICLE_CONTROLS, linkOptions, (key, value) => {
          linkOptions = { ...linkOptions, [key]: value };
        })}
      </Flex>
      <button class={styles.settings__button} onclick={clearLink}>Сбросить</button>
    </Flex>
  {/if}

  <button
    class={styles.button}
    onclick={toggleOpenHighlight}
    style="top: 10px; left: calc(10px + 185px + 20px + 220px + 20px + 161px + 20px + 185px + 20px)"
    >{openHighlight ? "Закрыть настройки анимации" : "Открыть настройки анимации"}</button
  >
  {#if openHighlight}
    <Flex
      class={styles.settings}
      vertical
      gap={20}
      style="top: 45px; left: calc(10px + 185px + 20px + 220px + 20px + 161px + 20px + 185px + 20px);"
    >
      <h1>Общие параметры:</h1>
      <Flex vertical gap={10} class={styles.settings__container}>
        {@render inputs(HIGHLIGHT_COMMON_CONTROLS, highlightSettings, (key, value) => {
          highlightSettings = { ...highlightSettings, [key]: value };
        })}
      </Flex>
      <h1>Анимация вершины:</h1>
      <h2>Вершина</h2>
      <Flex vertical gap={10} class={styles.settings__container}>
        {@render inputs(HIGHLIGHT_BY_NODE_FOR_NODE_CONTROLS, highlightSettings, (key, value) => {
          highlightSettings = { ...highlightSettings, [key]: value };
        })}
      </Flex>
      <h2>Текст</h2>
      <Flex vertical gap={10} class={styles.settings__container}>
        {@render inputs(HIGHLIGHT_BY_NODE_FOR_TEXT_CONTROLS, highlightSettings, (key, value) => {
          highlightSettings = { ...highlightSettings, [key]: value };
        })}
      </Flex>
      <h2>Подпись</h2>
      <Flex vertical gap={10} class={styles.settings__container}>
        {@render inputs(HIGHLIGHT_BY_NODE_FOR_LABEL_CONTROLS, highlightSettings, (key, value) => {
          highlightSettings = { ...highlightSettings, [key]: value };
        })}
      </Flex>
      <h2>Связь</h2>
      <Flex vertical gap={10} class={styles.settings__container}>
        {@render inputs(HIGHLIGHT_BY_NODE_FOR_LINK_CONTROLS, highlightSettings, (key, value) => {
          highlightSettings = { ...highlightSettings, [key]: value };
        })}
      </Flex>
      <h2>Стрелка</h2>
      <Flex vertical gap={10} class={styles.settings__container}>
        {@render inputs(HIGHLIGHT_BY_NODE_FOR_ARROW_CONTROLS, highlightSettings, (key, value) => {
          highlightSettings = { ...highlightSettings, [key]: value };
        })}
      </Flex>
      <h1>Анимация связи:</h1>
      <h2>Вершина</h2>
      <Flex vertical gap={10} class={styles.settings__container}>
        {@render inputs(HIGHLIGHT_BY_LINK_FOR_NODE_CONTROLS, highlightSettings, (key, value) => {
          highlightSettings = { ...highlightSettings, [key]: value };
        })}
      </Flex>
      <h2>Текст</h2>
      <Flex vertical gap={10} class={styles.settings__container}>
        {@render inputs(HIGHLIGHT_BY_LINK_FOR_TEXT_CONTROLS, highlightSettings, (key, value) => {
          highlightSettings = { ...highlightSettings, [key]: value };
        })}
      </Flex>
      <h2>Подпись</h2>
      <Flex vertical gap={10} class={styles.settings__container}>
        {@render inputs(HIGHLIGHT_BY_LINK_FOR_LABEL_CONTROLS, highlightSettings, (key, value) => {
          highlightSettings = { ...highlightSettings, [key]: value };
        })}
      </Flex>
      <h2>Связь</h2>
      <Flex vertical gap={10} class={styles.settings__container}>
        {@render inputs(HIGHLIGHT_BY_LINK_FOR_LINK_CONTROLS, highlightSettings, (key, value) => {
          highlightSettings = { ...highlightSettings, [key]: value };
        })}
      </Flex>
      <h2>Стрелка</h2>
      <Flex vertical gap={10} class={styles.settings__container}>
        {@render inputs(HIGHLIGHT_BY_LINK_FOR_ARROW_CONTROLS, highlightSettings, (key, value) => {
          highlightSettings = { ...highlightSettings, [key]: value };
        })}
      </Flex>

      <button class={styles.settings__button} onclick={clearHighlight}>Сбросить</button>
    </Flex>
  {/if}

  <button
    class={styles.button}
    onclick={importGraph}
    style="top: 10px; left: calc(10px + 185px + 20px + 220px + 20px + 161px + 20px + 185px + 20px + 200px + 20px);"
    >{"Импорт графа"}</button
  ><button
    class={styles.button}
    onclick={exportGraph}
    style="top: 10px; left: calc(10px + 185px + 20px + 220px + 20px + 161px + 20px + 185px + 20px +  200px + 20px + 110px + 20px);"
    >{"Экспорт графа"}</button
  >
</Flex>

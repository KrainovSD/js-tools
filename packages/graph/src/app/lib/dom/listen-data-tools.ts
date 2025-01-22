import type { LinkData, NodeData } from "@/app/types";
import type { GraphCanvas, GraphCanvasInterface } from "@/module/GraphCanvas";
import { createNewDynamicMock, customMock, d3Mock, realMock, stressMock } from "../../mock";
import * as tasks from "../../mock/tasks.json";
import { CONTROLS, DATA_TYPES, type ValueOf } from "./constants";

export function listenDataTools(
  graph: GraphCanvas<NodeData, LinkData>,
  proxy: {
    data: Pick<GraphCanvasInterface<NodeData, LinkData>, "nodes" | "links">;
  },
  initialData: ValueOf<typeof DATA_TYPES>,
) {
  let isWorking = true;
  let isStarted = true;
  let currentDataType: string | null = "stress";
  let dynamicInterval: NodeJS.Timeout | undefined;
  const dynamicClear = document.querySelector<HTMLElement>("button#clear");
  const dynamicSwitcher = document.querySelector<HTMLElement>("button#turn");
  const dynamicStopText = "Остановить";
  const dynamicStartText = "Запустить";

  dynamicClear?.addEventListener?.("click", function click() {
    graph.changeData({ links: [], nodes: [] });
  });

  dynamicSwitcher?.addEventListener?.("click", function click() {
    switch (this.textContent) {
      case dynamicStopText: {
        if (dynamicInterval) clearInterval(dynamicInterval);
        this.textContent = dynamicStartText;
        break;
      }
      case dynamicStartText: {
        startDynamic();
        this.textContent = dynamicStopText;
        break;
      }
      default: {
        break;
      }
    }
  });

  function startDynamic() {
    dynamicInterval = setInterval(() => {
      proxy.data = createNewDynamicMock(graph.getData());
      console.log(proxy.data);
      graph.changeData({ links: proxy.data.links, nodes: proxy.data.nodes });
    }, 300);
  }

  switch (initialData) {
    case DATA_TYPES.Custom: {
      proxy.data = customMock;
      break;
    }
    case DATA_TYPES.D3: {
      proxy.data = d3Mock;

      break;
    }
    case DATA_TYPES.Dynamic: {
      graph.changeData({ links: [], nodes: [] });
      startDynamic();
      if (dynamicClear) dynamicClear.style.display = "block";
      if (dynamicSwitcher) dynamicSwitcher.style.display = "block";

      break;
    }
    case DATA_TYPES.Real: {
      proxy.data = realMock;

      break;
    }
    case DATA_TYPES.Stress: {
      proxy.data = stressMock;

      break;
    }
    default: {
      proxy.data = tasks;
      break;
    }
  }

  graph.changeData({ links: proxy.data.links, nodes: proxy.data.nodes });

  document
    .querySelector("button#switcher")
    ?.addEventListener?.("click", function click(this: HTMLButtonElement) {
      if (dynamicInterval) clearInterval(dynamicInterval);

      if (isWorking) {
        graph.destroy();
        this.textContent = "Создать";
      } else {
        graph.create();
        this.textContent = "Уничтожить";
        if (currentDataType === "dynamic") startDynamic();
      }

      isWorking = !isWorking;
    });

  document
    .querySelector("button#starter")
    ?.addEventListener?.("click", function click(this: HTMLButtonElement) {
      if (dynamicInterval) clearInterval(dynamicInterval);

      if (isStarted) {
        graph.stop();
        this.textContent = "Запустить";
      } else {
        graph.start();
        this.textContent = "Остановить";
        if (currentDataType === "dynamic") startDynamic();
      }

      isStarted = !isStarted;
    });

  document
    .querySelector(`#${CONTROLS.Data}`)
    ?.querySelectorAll<HTMLInputElement>(`input`)
    .forEach((i) => {
      i.addEventListener?.("change", function click(this: HTMLInputElement) {
        if (dynamicInterval) clearInterval(dynamicInterval);
        currentDataType = this.value;
        if (dynamicClear) dynamicClear.style.display = "none";
        if (dynamicSwitcher) dynamicSwitcher.style.display = "none";

        switch (this.id) {
          case DATA_TYPES.D3: {
            proxy.data = d3Mock;
            graph.changeData({ links: proxy.data.links, nodes: proxy.data.nodes });

            break;
          }
          case DATA_TYPES.Real: {
            proxy.data = realMock;
            graph.changeData({ links: proxy.data.links, nodes: proxy.data.nodes });

            break;
          }
          case DATA_TYPES.Stress: {
            proxy.data = stressMock;
            graph.changeData({ links: proxy.data.links, nodes: proxy.data.nodes });

            break;
          }
          case DATA_TYPES.Custom: {
            proxy.data = customMock;
            graph.changeData({ links: proxy.data.links, nodes: proxy.data.nodes });

            break;
          }
          case DATA_TYPES.Dynamic: {
            graph.changeData({ links: [], nodes: [] });
            startDynamic();
            if (dynamicClear) dynamicClear.style.display = "block";
            if (dynamicSwitcher) dynamicSwitcher.style.display = "block";
            break;
          }
          default: {
            break;
          }
        }
      });

      if (i.id === initialData) i.checked = true;
    });
}

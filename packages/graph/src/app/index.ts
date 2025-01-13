/* eslint-disable no-console */
import { GraphCanvas } from "@/module/GraphCanvas";
import "./global.css";
import { createNewDynamicMock, customMock, d3Mock, stressMock } from "./mock";

const root = document.querySelector<HTMLElement>("div#container");
if (!root) throw new Error("hasn't root");

const graph = new GraphCanvas({
  links: d3Mock.links,
  nodes: d3Mock.nodes,
  root,
});

let isWorking = true;
let currentDataType: string | null = "stress";
let dynamicInterval: NodeJS.Timeout | undefined;
const dynamicClear = document.querySelector<HTMLElement>("button#clear");
const dynamicSwitcher = document.querySelector<HTMLElement>("button#turn");
const dynamicStopText = "Остановить";
const dynamicStartText = "Запустить";

function startDynamic() {
  dynamicInterval = setInterval(() => {
    const data = createNewDynamicMock(graph.getData());
    console.log(data);
    graph.changeData({ links: data.links, nodes: data.nodes });
  }, 300);
}

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

document
  .querySelector("button#switcher")
  ?.addEventListener?.("click", function click(this: HTMLButtonElement) {
    if (dynamicInterval) clearInterval(dynamicInterval);

    if (isWorking) {
      graph.destroy();
      this.textContent = "Создать";
    } else {
      graph.start();
      this.textContent = "Уничтожить";
      if (currentDataType === "dynamic") startDynamic();
    }

    isWorking = !isWorking;
  });

document.querySelectorAll<HTMLInputElement>(`input[type="radio"`).forEach((i) => {
  i.addEventListener?.("change", function click(this: HTMLInputElement) {
    if (dynamicInterval) clearInterval(dynamicInterval);
    currentDataType = this.value;
    if (dynamicClear) dynamicClear.style.display = "none";
    if (dynamicSwitcher) dynamicSwitcher.style.display = "none";

    switch (this.value) {
      case "d3": {
        graph.changeData({ links: d3Mock.links, nodes: d3Mock.nodes });

        break;
      }
      case "stress": {
        graph.changeData({ links: stressMock.links, nodes: stressMock.nodes });

        break;
      }
      case "custom": {
        graph.changeData({ links: customMock.links, nodes: customMock.nodes });

        break;
      }
      case "dynamic": {
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
});

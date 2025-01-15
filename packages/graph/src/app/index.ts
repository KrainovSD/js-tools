/* eslint-disable no-console */
import { GraphCanvas } from "@/module/GraphCanvas";
import "./global.css";
import { createNewDynamicMock, customMock, d3Mock, stressMock } from "./mock";

const root = document.querySelector<HTMLElement>("div#container");
if (!root) throw new Error("hasn't root");

const graph = new GraphCanvas({
  links: d3Mock.links,
  nodes: d3Mock.nodes,
  nodeSettings: {
    options: {
      radius: 5,
    },
  },
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

{
  let centralForce: number = 1;
  let repelForce: number = 40;
  let linkForce: number = 1;
  let linkDistance: number = 10;

  document
    .querySelector("#force")
    ?.querySelectorAll("input")
    ?.forEach?.((input) => {
      input.addEventListener("change", () => {
        switch (input.id) {
          case "central_force": {
            centralForce = +input.value;
            break;
          }
          case "repel_force": {
            repelForce = +input.value;
            break;
          }
          case "link_force": {
            linkForce = +input.value;
            break;
          }
          case "link_distance": {
            linkDistance = +input.value;
            break;
          }
          default: {
            break;
          }
        }

        graph.changeSettings({
          forceSettings: {
            centerStrength: centralForce,
            chargeStrength: repelForce * -1,
            linkStrength: linkForce,
            linkDistance,
          },
        });
      });

      switch (input.id) {
        case "central_force": {
          input.value = centralForce.toString();
          break;
        }
        case "repel_force": {
          input.value = repelForce.toString();

          break;
        }
        case "link_force": {
          input.value = linkForce.toString();

          break;
        }
        case "link_distance": {
          input.value = linkDistance.toString();

          break;
        }
        default: {
          break;
        }
      }
    });
}

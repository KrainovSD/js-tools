/* eslint-disable no-console */
import { GraphCanvas, type GraphCanvasInterface } from "@/module/GraphCanvas";
import "./global.css";
import { getLinkCount } from "./lib";
import { createNewDynamicMock, customMock, d3Mock, stressMock } from "./mock";
import type { LinkData, NodeData } from "./types";

let data: Pick<GraphCanvasInterface<NodeData, LinkData>, "nodes" | "links"> = {
  links: [],
  nodes: [],
};
const proxy = new Proxy(
  { data },
  {
    set(target, prop, val) {
      const value = val as Pick<GraphCanvasInterface<NodeData, LinkData>, "nodes" | "links">;
      getLinkCount(value);
      data = value;

      return true;
    },
  },
);
proxy.data = d3Mock;

const root = document.querySelector<HTMLElement>("div#container");
if (!root) throw new Error("hasn't root");

const graph = new GraphCanvas({
  links: data.links,
  nodes: data.nodes,
  nodeSettings: {
    options: {
      // radius: 4,
    },
  },
  linkSettings: {},
  listeners: {
    onSimulationEnd: () => {
      console.log("simulation ended");
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
    proxy.data = createNewDynamicMock(graph.getData());
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
        proxy.data = d3Mock;
        graph.changeData({ links: data.links, nodes: data.nodes });

        break;
      }
      case "stress": {
        proxy.data = stressMock;
        graph.changeData({ links: data.links, nodes: data.nodes });

        break;
      }
      case "custom": {
        proxy.data = customMock;
        graph.changeData({ links: data.links, nodes: data.nodes });

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
  let isCollideActive: boolean = true;
  let xForce: number = 0.1;
  let yForce: number = 0.1;
  let radiusCoefficient: number = 5;
  let radiusFactor: number = 1;

  document
    .querySelector("#force")
    ?.querySelectorAll("input")
    ?.forEach?.((input) => {
      input.addEventListener("input", () => {
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
          case "x_force": {
            xForce = +input.value;
            break;
          }
          case "y_force": {
            yForce = +input.value;
            break;
          }
          case "radius_coefficient": {
            radiusCoefficient = +input.value;
            break;
          }
          case "radius_factor": {
            radiusFactor = +input.value;
            break;
          }
          case "collide": {
            isCollideActive = input.checked;
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
            collideOn: isCollideActive,
            xStrength: xForce,
            yStrength: yForce,
          },
          nodeSettings: {
            options: {
              radiusCoefficient,
              radiusFactor,
            },
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
        case "x_force": {
          input.value = xForce.toString();
          break;
        }
        case "y_force": {
          input.value = yForce.toString();
          break;
        }
        case "radius_coefficient": {
          input.value = radiusCoefficient.toString();
          break;
        }
        case "radius_factor": {
          input.value = radiusFactor.toString();
          break;
        }
        case "collide": {
          input.checked = isCollideActive;
          break;
        }
        default: {
          break;
        }
      }
    });
}

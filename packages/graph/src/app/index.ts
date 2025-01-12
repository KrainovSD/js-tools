/* eslint-disable no-console */
import { GraphCanvas } from "@/module/GraphCanvas";
import "./global.css";
import { customMock, d3Mock, stressMock } from "./mock";

let isWorking = true;
const root = document.querySelector<HTMLElement>("div#container");
if (!root) throw new Error("hasn't root");

const graph = new GraphCanvas({
  links: d3Mock.links,
  nodes: d3Mock.nodes,
  root,
});
console.log(graph);

document
  .querySelector("button#switcher")
  ?.addEventListener?.("click", function click(this: HTMLButtonElement) {
    if (isWorking) {
      graph.destroy();
      this.textContent = "Запустить";
    } else {
      graph.start();
      this.textContent = "Очистить";
    }

    isWorking = !isWorking;
  });
document.querySelectorAll<HTMLInputElement>(`input[type="radio"`).forEach((i) => {
  i.addEventListener?.("change", function click(this: HTMLInputElement) {
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
      default: {
        break;
      }
    }
  });
});

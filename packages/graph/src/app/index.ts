/* eslint-disable no-console */
import { Graph } from "@/module/Graph";
import "./global.css";
import { dataJson, dataMock } from "./mock";

let isWorking = true;
let currentData: "json" | "custom" = "json";
const graph = new Graph({
  height: 680,
  width: 928,
  links: dataJson.links,
  nodes: dataJson.nodes,
  selector: "#root",
});
console.log(graph);

document
  .querySelector("button#switcher")
  ?.addEventListener?.("click", function click(this: HTMLButtonElement) {
    if (isWorking) {
      graph.stop();
      this.textContent = "Запустить";
    } else {
      graph.start();
      this.textContent = "Очистить";
    }

    isWorking = !isWorking;
  });
document
  .querySelector("button#data")
  ?.addEventListener?.("click", function click(this: HTMLButtonElement) {
    if (currentData === "json") {
      graph.changeGraph({ nodes: dataMock.nodes, links: dataMock.links });
      currentData = "custom";
    } else {
      graph.changeGraph({ nodes: dataJson.nodes, links: dataJson.links });
      currentData = "json";
    }
  });

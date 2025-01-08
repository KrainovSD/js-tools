/* eslint-disable no-console */
import { GraphCanvas } from "@/module/GraphCanvas";
import "./global.css";
import { dataJson, dataMock } from "./mock";

let isWorking = true;
let currentData: "json" | "custom" = "json";
const root = document.querySelector<HTMLElement>("div#container");
if (!root) throw new Error("hasn't root");

const graph = new GraphCanvas({
  links: dataJson.links,
  nodes: dataJson.nodes,
  root,
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
      graph.changeData({
        nodes: JSON.parse(JSON.stringify(dataMock.nodes)),
        links: JSON.parse(JSON.stringify(dataMock.links)),
      });
      currentData = "custom";
    } else {
      graph.changeData({ nodes: dataJson.nodes, links: dataJson.links });
      currentData = "json";
    }
  });

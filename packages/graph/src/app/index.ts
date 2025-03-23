// import "./native";
import { mount } from "svelte";
import "./global.css";
import Graph from "./graph.svelte";
import Settings from "./settings.svelte";

const targetGraph = document.getElementById("app") ?? document.body;
targetGraph.innerHTML = "";
mount(Graph, {
  target: targetGraph,
});
const targetSettings = document.getElementById("settings") ?? document.body;
targetSettings.innerHTML = "";
mount(Settings, {
  target: targetSettings,
});

# @krainovsd/graph

## Download

```
pnpm i @krainovsd/graph
```

## Usage


```ts
import { Graph } from "@krainovsd/graph";

const root = document.querySelector<HTMLElement>("div#container");
const graph = new Graph({
  links,
  nodes,
  root,
});
```

## API

### root

Type: `HTMLElement`<br>
Required: `true`

The node for mounting the graph.


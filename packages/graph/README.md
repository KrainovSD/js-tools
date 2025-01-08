# @krainovsd/graph

## Download

```
pnpm i @krainovsd/graph
```

## Usage


```ts
import { Graph } from "@krainovsd/graph";

const graph = new Graph({
  height: 680,
  width: 928,
  links,
  nodes,
  selector: "#root",
});
```

## API

### selector

Type: `string`<br>
Required: `true`

Selector of the node for mounting the graph.


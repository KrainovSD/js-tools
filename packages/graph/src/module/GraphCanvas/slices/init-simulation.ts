import {
  type ForceLink,
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
} from "d3-force";
import { getDrawTime, resetDrawTime } from "@/lib";
import type { GraphCanvas } from "../GraphCanvas";
import { nodeIterationExtractor } from "../lib";
import type { LinkInterface, NodeInterface } from "../types";

export function initSimulation<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(this: GraphCanvas<NodeData, LinkData>) {
  if (!this.simulation) {
    this.simulation = forceSimulation<NodeInterface<NodeData>, LinkInterface<NodeData, LinkData>>()
      .nodes(this.nodes)
      .force(
        "link",
        forceLink<NodeInterface<NodeData>, LinkInterface<NodeData, LinkData>>(this.links).id(
          this.nodeSettings.idGetter.bind(this),
        ),
      )
      .on("tick", () => {
        this.draw();
      })
      .on("end", () => {
        this.listeners.onSimulationEnd?.call?.(this);

        if (this.graphSettings.showDrawTime) {
          getDrawTime();
          // eslint-disable-next-line no-console
          console.log(`nodes: ${this.nodes.length} | links: ${this.links.length}`);
          resetDrawTime();
        }
      });

    initSimulationForces.call<
      GraphCanvas<NodeData, LinkData>,
      Parameters<typeof initSimulationForces>,
      ReturnType<typeof initSimulationForces>
    >(this);
  }
}

export function initSimulationForces<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(this: GraphCanvas<NodeData, LinkData>) {
  if (!this.simulation) return;

  const linkForce = this.simulation.force("link") as
    | ForceLink<NodeInterface<NodeData>, LinkInterface<NodeData, LinkData>>
    | undefined;

  if (!linkForce) return;

  if ((!this.forceSettings.forces || !this.forceSettings.xForce) && this.simulation.force("x")) {
    this.simulation.force("x", null);
  }
  if ((!this.forceSettings.forces || !this.forceSettings.yForce) && this.simulation.force("y")) {
    this.simulation.force("y", null);
  }
  if (
    (!this.forceSettings.forces || !this.forceSettings.chargeForce) &&
    this.simulation.force("charge")
  ) {
    this.simulation.force("charge", null);
  }
  if (
    (!this.forceSettings.forces || !this.forceSettings.centerForce) &&
    this.simulation.force("center")
  ) {
    this.simulation.force("center", null);
  }
  if (!this.forceSettings.forces || !this.forceSettings.linkForce) {
    linkForce.distance(0).strength(0).iterations(0);
  }

  if (this.forceSettings.forces && this.forceSettings.linkForce) {
    linkForce
      .distance(this.forceSettings.linkDistance)
      .strength(this.forceSettings.linkStrength)
      .iterations(this.forceSettings.linkIterations);
  }
  if (this.forceSettings.forces && this.forceSettings.xForce) {
    this.simulation.force(
      "x",
      forceX<NodeInterface<NodeData>>(this.forceSettings.xPosition).strength(
        this.forceSettings.xStrength,
      ),
    );
  }
  if (this.forceSettings.forces && this.forceSettings.yForce) {
    this.simulation.force(
      "y",
      forceY<NodeInterface<NodeData>>(this.forceSettings.yPosition).strength(
        this.forceSettings.yStrength,
      ),
    );
  }
  if (this.forceSettings.forces && this.forceSettings.chargeForce) {
    this.simulation.force(
      "charge",
      forceManyBody<NodeInterface<NodeData>>()
        .strength(this.forceSettings.chargeStrength)
        .distanceMax(Infinity)
        .distanceMin(this.forceSettings.chargeDistanceMin),
    );
  }
  if (this.forceSettings.forces && this.forceSettings.centerForce) {
    this.simulation.force(
      "center",
      forceCenter<NodeInterface<NodeData>>(
        this.forceSettings.centerPosition.x ?? 0,
        this.forceSettings.centerPosition.y ?? 0,
      ).strength(this.forceSettings.centerStrength),
    );
  }

  initCollideForce.call<
    GraphCanvas<NodeData, LinkData>,
    Parameters<typeof initCollideForce>,
    ReturnType<typeof initCollideForce>
  >(this, true);
}

export function initCollideForce<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(this: GraphCanvas<NodeData, LinkData>, forceUpdate: boolean) {
  if (!this.simulation) return;

  if (
    (!this.forceSettings.collideForce || !this.forceSettings.forces) &&
    this.simulation.force("collide")
  ) {
    this.simulation.force("collide", null);
  }

  if (this.forceSettings.forces && this.forceSettings.collideForce) {
    const isHasMax =
      this.forceSettings.collideOffMax.links != 0 && this.forceSettings.collideOffMax.nodes != 0;
    const isMaxCollideNodes =
      isHasMax && this.forceSettings.collideOffMax.nodes < this.nodes.length;
    const isMaxCollideLinks =
      isHasMax && this.forceSettings.collideOffMax.links < this.links.length;
    if (isMaxCollideNodes && isMaxCollideLinks) {
      this.simulation.force("collide", null);
    } else if (!this.simulation.force("collide") || forceUpdate) {
      this.simulation.force(
        "collide",
        forceCollide<NodeInterface<NodeData>>()
          .radius((node, index) => {
            const nodeOptions = this.nodeOptionsCache[node.id];
            if (!nodeOptions) return 0;

            switch (nodeOptions.shape) {
              case "circle": {
                if (this.forceSettings.collideRadius) {
                  return nodeIterationExtractor(
                    node,
                    index,
                    this.nodes,
                    this,
                    this.forceSettings.collideRadius,
                    undefined,
                  );
                }

                return nodeOptions.radius + this.forceSettings.collideAdditionalRadius;
              }
              case "square": {
                return (
                  Math.sqrt(nodeOptions.width ** 2 + nodeOptions.height ** 2) / 2 +
                  this.forceSettings.collideAdditionalRadius
                );
              }
              case "text": {
                return (
                  Math.sqrt(nodeOptions.width ** 2 + nodeOptions.height ** 2) / 2 +
                  this.forceSettings.collideAdditionalRadius
                );
              }
              default: {
                if (this.forceSettings.collideRadius) {
                  return nodeIterationExtractor(
                    node,
                    index,
                    this.nodes,
                    this,
                    this.forceSettings.collideRadius,
                    undefined,
                  );
                }

                return nodeOptions.radius + this.forceSettings.collideAdditionalRadius;
              }
            }
          })
          .strength(this.forceSettings.collideStrength)
          .iterations(this.forceSettings.collideIterations),
      );
    }
  }
}

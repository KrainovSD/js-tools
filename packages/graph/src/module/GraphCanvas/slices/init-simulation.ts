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
import type { LinkInterface, NodeInterface } from "@/types";
import type { GraphCanvas } from "../GraphCanvas";
import { nodeIterationExtractor, nodeOptionsGetter, nodeRadiusGetter } from "../lib";

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
          this.nodeSettings.idGetter,
        ),
      )
      .on("tick", () => {
        this.draw();
      })
      .on("end", () => {
        this.listeners.onSimulationEnd?.(this.state);

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

  linkForce
    .distance(this.forceSettings.linkDistance)
    .strength(this.forceSettings.linkStrength)
    .iterations(this.forceSettings.linkIterations);

  this.simulation
    .force(
      "x",
      forceX<NodeInterface<NodeData>>(this.forceSettings.xForce).strength(
        this.forceSettings.xStrength,
      ),
    )
    .force(
      "y",
      forceY<NodeInterface<NodeData>>(this.forceSettings.yForce).strength(
        this.forceSettings.yStrength,
      ),
    )
    .force(
      "charge",
      forceManyBody<NodeInterface<NodeData>>()
        .strength(this.forceSettings.chargeStrength)
        .distanceMax(this.forceSettings.chargeDistanceMax)
        .distanceMin(this.forceSettings.chargeDistanceMin),
    )
    .force(
      "center",
      forceCenter<NodeInterface<NodeData>>(
        this.forceSettings.centerPosition.x ?? 0,
        this.forceSettings.centerPosition.y ?? 0,
      ).strength(this.forceSettings.centerStrength),
    );

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

  if (!this.forceSettings.collideOn) {
    if (this.simulation.force("collide")) this.simulation.force("collide", null);

    return;
  }

  const isHasMax =
    this.forceSettings.collideOffMax.links != 0 && this.forceSettings.collideOffMax.nodes != 0;
  const isMaxCollideNodes = isHasMax && this.forceSettings.collideOffMax.nodes < this.nodes.length;
  const isMaxCollideLinks = isHasMax && this.forceSettings.collideOffMax.links < this.links.length;
  if (isMaxCollideNodes && isMaxCollideLinks) {
    this.simulation.force("collide", null);
  } else if (!this.simulation.force("collide") || forceUpdate) {
    this.simulation.force(
      "collide",
      forceCollide<NodeInterface<NodeData>>()
        .radius((node, index) => {
          if (this.forceSettings.collideRadius) {
            return nodeIterationExtractor(
              node,
              index,
              this.nodes,
              this.state,
              this.forceSettings.collideRadius,
              undefined,
            );
          }
          const nodeOptions = nodeIterationExtractor(
            node,
            index,
            this.nodes,
            this.state,
            this.nodeSettings.options ?? {},
            nodeOptionsGetter,
          );
          const radius = nodeRadiusGetter({
            radiusFlexible: this.nodeSettings.nodeRadiusFlexible,
            radiusInitial: nodeOptions.radius ?? this.nodeSettings.nodeRadiusInitial,
            radiusCoefficient: this.nodeSettings.nodeRadiusCoefficient,
            radiusFactor: this.nodeSettings.nodeRadiusFactor,
            linkCount: node.linkCount,
          });

          return radius + this.forceSettings.collideAdditionalRadius;
        })
        .strength(this.forceSettings.collideStrength)
        .iterations(this.forceSettings.collideIterations),
    );
  }
}

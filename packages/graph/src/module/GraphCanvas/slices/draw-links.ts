import type { LinkInterface } from "@/types";
import type { GraphCanvas } from "../GraphCanvas";
import {
  animationByProgress,
  calculateLinkPositionByRadius,
  getParticlePosition,
  linkIterationExtractor,
  linkOptionsGetter,
} from "../lib";
import type { GraphParticle, GraphState, LinkOptionsInterface } from "../types";

export function getDrawLink<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>(state: GraphState<NodeData, LinkData>) {
  return function drawLink(
    this: GraphCanvas<NodeData, LinkData>,
    link: LinkInterface<NodeData, LinkData>,
    index: number,
  ) {
    if (
      !this.context ||
      typeof link.source !== "object" ||
      typeof link.target !== "object" ||
      !link.source.x ||
      !link.source.y ||
      !link.target.x ||
      !link.target.y
    )
      return;

    if (!link.source._visible && !link.target._visible) return;

    const id = `${link.target.id}${link.source.id}`;
    let linkOptions: Required<LinkOptionsInterface<NodeData, LinkData>>;
    if (this.linkSettings.cache && this.linkOptionsCache[id]) {
      linkOptions = this.linkOptionsCache[id];
    } else {
      linkOptions = linkIterationExtractor(
        link,
        index,
        this.links,
        state,
        this.linkSettings.options ?? {},
        linkOptionsGetter,
      );
      if (this.linkSettings.cache) {
        this.linkOptionsCache[id] = linkOptions;
      }
    }

    if (linkOptions.drawLink) {
      linkOptions.drawLink(link, linkOptions, state);

      return;
    }

    let alpha = linkOptions.alpha;
    let arrowAlpha = this.linkSettings.arrowByHighlight ? 0 : linkOptions.arrowAlpha;

    /** NODE HIGHLIGHT */
    if (this.highlightedNeighbors && this.highlightedNode) {
      /** Not highlighted */
      if (this.highlightedNode.id != link.source.id && this.highlightedNode.id != link.target.id) {
        if (this.linkSettings.highlightByNodeLinkFading) {
          const min =
            this.linkSettings.highlightByNodeLinkFadingMin < alpha
              ? this.linkSettings.highlightByNodeLinkFadingMin
              : alpha;
          alpha = animationByProgress(min, alpha - min, 1 - this.highlightProgress);
        }
        if (
          this.linkSettings.arrow &&
          this.linkSettings.highlightByNodeArrowFading &&
          !this.linkSettings.arrowByHighlight
        ) {
          const min =
            this.linkSettings.highlightByNodeArrowFadingMin < arrowAlpha
              ? this.linkSettings.highlightByNodeArrowFadingMin
              : arrowAlpha;
          arrowAlpha = animationByProgress(min, arrowAlpha - min, 1 - this.highlightProgress);
        }
      } else {
        // eslint-disable-next-line no-lonely-if
        if (this.linkSettings.arrow && this.linkSettings.arrowByHighlight) {
          /** Highlighted */
          arrowAlpha = animationByProgress(0, linkOptions.arrowAlpha, this.highlightProgress);
        }
      }
    }
    /** LINK HIGHLIGHT */
    if (this.highlightedNeighbors && this.highlightedLink) {
      /** Not highlighted */
      if (this.highlightedLink !== link) {
        if (this.linkSettings.highlightByLinkLinkFading) {
          const min =
            this.linkSettings.highlightByLinkLinkFadingMin < alpha
              ? this.linkSettings.highlightByLinkLinkFadingMin
              : alpha;
          alpha = animationByProgress(min, alpha - min, 1 - this.highlightProgress);
        }
        if (
          this.linkSettings.arrow &&
          this.linkSettings.highlightByLinkArrowFading &&
          !this.linkSettings.arrowByHighlight
        ) {
          const min =
            this.linkSettings.highlightByLinkArrowFadingMin < arrowAlpha
              ? this.linkSettings.highlightByLinkArrowFadingMin
              : arrowAlpha;
          arrowAlpha = animationByProgress(min, arrowAlpha - min, 1 - this.highlightProgress);
        }
      } else {
        // eslint-disable-next-line no-lonely-if
        if (this.linkSettings.arrow && this.linkSettings.arrowByHighlight) {
          /** Highlighted */
          arrowAlpha = animationByProgress(0, linkOptions.arrowAlpha, this.highlightProgress);
        }
      }
    }

    /** Link */
    this.context.beginPath();

    this.context.globalAlpha = alpha;
    this.context.strokeStyle = linkOptions.color;
    this.context.lineWidth = linkOptions.width;

    let xStart = link.source.x;
    let yStart = link.source.y;
    let xEnd = link.target.x;
    let yEnd = link.target.y;
    let linkDistance = 0;
    if (this.linkSettings.pretty || this.linkSettings.particleFlexSpeed) {
      const isHasArrow = this.linkSettings.arrow && arrowAlpha > 0;
      const position = calculateLinkPositionByRadius(link, isHasArrow ? linkOptions.arrowSize : 0);

      if (position) {
        xStart = position.x1;
        xEnd = position.x2;
        yStart = position.y1;
        yEnd = position.y2;
        linkDistance = position.distance;
      }
    }
    this.context.moveTo(xStart, yStart);
    this.context.lineTo(xEnd, yEnd);
    this.context.stroke();

    /** Particle */
    if (
      this.linkSettings.particles &&
      ((this.highlightedNode &&
        (this.highlightedNode.id === link.source.id ||
          this.highlightedNode.id === link.target.id)) ||
        (this.highlightedLink && this.highlightedLink === link))
    ) {
      const particleSteps = this.linkSettings.particleFlexSpeed
        ? linkDistance <= 0
          ? 0
          : linkDistance * this.linkSettings.particleFlexSpeedCoefficient
        : linkOptions.particleSteps;
      const particleCount = linkOptions.particleCount;

      if (!this.particles[id]) {
        const sourceId = link.source.id;
        const targetId = link.target.id;

        const particles: GraphParticle[] = [];
        let prevParticle: GraphParticle | undefined;

        for (let i = 0; i < particleCount; i++) {
          const particle: GraphParticle = {
            step: 0,
            sourceId,
            targetId,
            prev: prevParticle,
            next: undefined,
            index: i,
          };
          if (prevParticle) prevParticle.next = particle;
          particles.push(particle);
          prevParticle = particle;
        }
        if (particles.length >= 2) {
          particles[0].prev = particles[particles.length - 1];
          particles[particles.length - 1].next = particles[0];
        }
        this.particles[id] = particles;
      }

      if (particleSteps !== 0) {
        this.particles[id].forEach((particle) => {
          if (!this.context) return;

          const distance = particleSteps / particleCount;
          getParticlePosition({
            distance,
            particle,
            totalSteps: particleSteps,
            totalCount: particleCount,
            xEnd,
            xStart,
            yEnd,
            yStart,
          });
          if (particle.x != undefined && particle.y != undefined) {
            this.context.beginPath();
            this.context.strokeStyle = linkOptions.particleBorderColor;
            this.context.lineWidth = linkOptions.particleBorderWidth;
            this.context.arc(particle.x, particle.y, linkOptions.particleRadius, 0, Math.PI * 2);
            this.context.fillStyle = linkOptions.particleColor;
            this.context.fill();
            this.context.stroke();
          }
        });
      }
    }

    /** Arrow */
    if (this.linkSettings.arrow && arrowAlpha > 0) {
      const {
        x1: xStart,
        x2: xEnd,
        y1: yStart,
        y2: yEnd,
      } = calculateLinkPositionByRadius(link) ?? {
        x1: 0,
        x2: 0,
        y1: 0,
        y2: 0,
      };

      this.context.beginPath();
      this.context.globalAlpha = arrowAlpha;
      this.context.strokeStyle = linkOptions.arrowBorderColor;
      this.context.lineWidth = linkOptions.arrowBorderWidth;
      this.context.fillStyle = linkOptions.arrowColor;
      const angle = Math.atan2(yEnd - yStart, xEnd - xStart);
      this.context.moveTo(xEnd, yEnd);
      this.context.lineTo(
        xEnd - linkOptions.arrowSize * Math.cos(angle - Math.PI / 6),
        yEnd - linkOptions.arrowSize * Math.sin(angle - Math.PI / 6),
      );
      this.context.lineTo(
        xEnd - linkOptions.arrowSize * Math.cos(angle + Math.PI / 6),
        yEnd - linkOptions.arrowSize * Math.sin(angle + Math.PI / 6),
      );
      this.context.closePath();
      this.context.fill();
      this.context.stroke();
    }

    if (linkOptions.drawExtraLink) {
      linkOptions.drawExtraLink(link, { ...linkOptions, alpha }, state);
    }
  };
}

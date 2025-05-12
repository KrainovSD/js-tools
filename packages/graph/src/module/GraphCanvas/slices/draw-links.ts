import type { GraphCanvas } from "../GraphCanvas";
import {
  calculateLinkPositionByNode,
  getParticlePosition,
  linkFade,
  linkHighlight,
  linkIterationExtractor,
  linkOptionsGetter,
} from "../lib";
import type { GraphState, LinkInterface, LinkOptionsInterface, LinkParticle } from "../types";

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
    if (this.linkSettings.cacheOptions && this.linkOptionsCache[id]) {
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
      if (this.linkSettings.cacheOptions) {
        this.linkOptionsCache[id] = linkOptions;
      }
    }

    if (linkOptions.drawLink) {
      linkOptions.drawLink(link, linkOptions, state);

      return;
    }

    let alpha = linkOptions.alpha;
    let color = linkOptions.color;
    let width = linkOptions.width;
    let arrowAlpha = this.linkSettings.arrowByHighlight ? 0 : linkOptions.arrowAlpha;
    let arrowColor = linkOptions.arrowColor;
    let arrowSize = linkOptions.arrowSize;
    let arrowBorderWidth = linkOptions.arrowBorderWidth;
    let arrowBorderColor = linkOptions.arrowBorderColor;

    /** Highlight */
    if (this.highlightedNeighbors && this.highlightedNode) {
      /** By Node Not Highlight */
      if (this.highlightedNode.id != link.source.id && this.highlightedNode.id != link.target.id) {
        const fadeOptions = linkFade({
          arrow: this.linkSettings.arrow,
          arrowByHighlight: this.linkSettings.arrowByHighlight,
          linkOptions,
          highlightProgress: this.highlightProgress,
          highlightForArrowFadingMin: this.highlightSettings.highlightByNodeForArrowFadingMin,
          highlightForLinkFadingMin: this.highlightSettings.highlightByNodeForLinkFadingMin,
        });
        alpha = fadeOptions.alpha;
        arrowAlpha = fadeOptions.arrowAlpha;
      } else {
        const highlightOptions = linkHighlight({
          arrow: this.linkSettings.arrow,
          arrowByHighlight: this.linkSettings.arrowByHighlight,
          linkOptions,
          highlightProgress: this.highlightProgress,
          highlightForArrowBorderColor: this.highlightSettings.highlightByNodeForArrowBorderColor,
          highlightForArrowBorderSizingAdditional:
            this.highlightSettings.highlightByNodeForArrowBorderSizingAdditional,
          highlightForArrowColor: this.highlightSettings.highlightByNodeForArrowColor,
          highlightForArrowSizeAdditional:
            this.highlightSettings.highlightByNodeForArrowSizeAdditional,
          highlightForLinkColor: this.highlightSettings.highlightByNodeForLinkColor,
          highlightForLinkSizeAdditional:
            this.highlightSettings.highlightByNodeForLinkSizeAdditional,
        });
        arrowAlpha = highlightOptions.arrowAlpha;
        color = highlightOptions.color;
        width = highlightOptions.width;
        arrowColor = highlightOptions.arrowColor;
        arrowSize = highlightOptions.arrowSize;
        arrowBorderWidth = highlightOptions.arrowBorderWidth;
        arrowBorderColor = highlightOptions.arrowBorderColor;
      }
    }
    if (this.highlightedNeighbors && this.highlightedLink) {
      /** By Link Not Highlight */
      if (this.highlightedLink !== link) {
        const fadeOptions = linkFade({
          arrow: this.linkSettings.arrow,
          arrowByHighlight: this.linkSettings.arrowByHighlight,
          linkOptions,
          highlightProgress: this.highlightProgress,
          highlightForArrowFadingMin: this.highlightSettings.highlightByLinkForArrowFadingMin,
          highlightForLinkFadingMin: this.highlightSettings.highlightByLinkForLinkFadingMin,
        });
        alpha = fadeOptions.alpha;
        arrowAlpha = fadeOptions.arrowAlpha;
      } else {
        /** By Link Highlight */
        const highlightOptions = linkHighlight({
          arrow: this.linkSettings.arrow,
          arrowByHighlight: this.linkSettings.arrowByHighlight,
          linkOptions,
          highlightProgress: this.highlightProgress,
          highlightForArrowBorderColor: this.highlightSettings.highlightByLinkForArrowBorderColor,
          highlightForArrowBorderSizingAdditional:
            this.highlightSettings.highlightByLinkForArrowBorderSizingAdditional,
          highlightForArrowColor: this.highlightSettings.highlightByLinkForArrowColor,
          highlightForArrowSizeAdditional:
            this.highlightSettings.highlightByLinkForArrowSizeAdditional,
          highlightForLinkColor: this.highlightSettings.highlightByLinkForLinkColor,
          highlightForLinkSizeAdditional:
            this.highlightSettings.highlightByLinkForLinkSizeAdditional,
        });
        arrowAlpha = highlightOptions.arrowAlpha;
        color = highlightOptions.color;
        width = highlightOptions.width;
        arrowColor = highlightOptions.arrowColor;
        arrowSize = highlightOptions.arrowSize;
        arrowBorderWidth = highlightOptions.arrowBorderWidth;
        arrowBorderColor = highlightOptions.arrowBorderColor;
      }
    }

    /** Link */
    this.context.beginPath();

    this.context.globalAlpha = alpha;
    this.context.strokeStyle = color;
    this.context.lineWidth = width;

    let xStart = link.source.x;
    let yStart = link.source.y;
    let xEnd = link.target.x;
    let yEnd = link.target.y;
    let linkDistance = 0;
    if (this.linkSettings.prettyDraw || this.linkSettings.particleFlexSpeed) {
      const isHasArrow = this.linkSettings.arrow && arrowAlpha > 0;
      const position = calculateLinkPositionByNode(link, isHasArrow ? arrowSize : 0);

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

        const particles: LinkParticle[] = [];
        let prevParticle: LinkParticle | undefined;

        for (let i = 0; i < particleCount; i++) {
          const particle: LinkParticle = {
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
            if (linkOptions.particleBorderWidth > 0) {
              this.context.stroke();
            }
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
      } = calculateLinkPositionByNode(link) ?? {
        x1: 0,
        x2: 0,
        y1: 0,
        y2: 0,
      };

      this.context.beginPath();
      this.context.globalAlpha = arrowAlpha;
      this.context.strokeStyle = arrowBorderColor;
      this.context.lineWidth = arrowBorderWidth;
      this.context.fillStyle = arrowColor;
      const angle = Math.atan2(yEnd - yStart, xEnd - xStart);
      this.context.moveTo(xEnd, yEnd);
      this.context.lineTo(
        xEnd - arrowSize * Math.cos(angle - Math.PI / 6),
        yEnd - arrowSize * Math.sin(angle - Math.PI / 6),
      );
      this.context.lineTo(
        xEnd - arrowSize * Math.cos(angle + Math.PI / 6),
        yEnd - arrowSize * Math.sin(angle + Math.PI / 6),
      );
      this.context.closePath();
      this.context.fill();
      if (arrowBorderWidth > 0) {
        this.context.stroke();
      }
    }

    if (linkOptions.drawExtraLink) {
      linkOptions.drawExtraLink(link, { ...linkOptions, alpha }, state);
    }
  };
}

import type { GraphCanvas } from "../GraphCanvas";
import { calculateLinkPositionByNode, getParticlePosition, linkFade, linkHighlight } from "../lib";
import { calculateCurveLinkPositionByNode } from "../lib/utils/calculate-curve-link-position-by-node";
import { approximateQuadraticBezierLength } from "../lib/utils/get-particle-position";
import type { LinkInterface, LinkParticle } from "../types";

export function getDrawLink<
  NodeData extends Record<string, unknown>,
  LinkData extends Record<string, unknown>,
>() {
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

    if (
      (link.visible != undefined && !link.visible) ||
      (link.source.visible != undefined && !link.source.visible) ||
      (link.target.visible != undefined && !link.target.visible)
    )
      return;

    if (!link.source._visible && !link.target._visible) return;

    const linkOptions = this.linkOptionsCache[index];
    if (!linkOptions) return;

    if (linkOptions.drawLink) {
      linkOptions.drawLink.call(this, link, linkOptions);

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

    const currentNodeHighlighted =
      this.highlightedNode &&
      (this.highlightedNode.id == link.source.id || this.highlightedNode.id == link.target.id);
    /** Highlight */
    if (this.highlightedNeighbors && this.highlightedNode) {
      /** By Node Not Highlight */
      if (!currentNodeHighlighted) {
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

    const currentLinkHighlighted = this.highlightedLink === link;
    if (this.highlightedNeighbors && this.highlightedLink) {
      /** By Link Not Highlight */
      if (!currentLinkHighlighted) {
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
    let xControl = 0;
    let yControl = 0;
    let xEndArrow = xEnd;
    let yEndArrow = yEnd;
    let linkDistance = 0;
    const isHasArrow = this.linkSettings.arrow && arrowAlpha > 0;
    if (!this.linkSettings.curve) {
      if (
        this.linkSettings.prettyDraw ||
        (this.linkSettings.arrow && arrowAlpha > 0) ||
        (this.particles && (currentNodeHighlighted || currentLinkHighlighted))
      ) {
        const position = calculateLinkPositionByNode(
          xStart,
          yStart,
          xEnd,
          yEnd,
          link.source,
          link.target,
          isHasArrow ? arrowSize : 0,
        );

        xStart = position.xStart;
        xEnd = position.xEnd;
        yStart = position.yStart;
        yEnd = position.yEnd;
        xEndArrow = position.xEndArrow;
        yEndArrow = position.yEndArrow;
        linkDistance = position.distance;
      }
      link._x1 = xStart;
      link._y1 = yStart;
      link._x2 = xEnd;
      link._y2 = yEnd;
      link._ax = xEndArrow;
      link._ay = yEndArrow;
      this.context.moveTo(xStart, yStart);
      this.context.lineTo(xEnd, yEnd);
      this.context.stroke();
    } else {
      const position = calculateCurveLinkPositionByNode(
        xStart,
        yStart,
        xEnd,
        yEnd,
        link.source,
        link.target,
        link._groupIndex ?? 0,
        isHasArrow ? arrowSize : 0,
      );
      xStart = position.xStart;
      yStart = position.yStart;
      xEnd = position.xEnd;
      yEnd = position.yEnd;
      xControl = position.xControl;
      yControl = position.yControl;
      xEndArrow = position.xEndArrow;
      yEndArrow = position.yEndArrow;
      link._x1 = position.xStart;
      link._y1 = position.yStart;
      link._x2 = position.xEnd;
      link._y2 = position.yEnd;
      link._cx = position.xControl;
      link._cy = position.yControl;
      link._ax = position.xEndArrow;
      link._ay = position.yEndArrow;
      linkDistance = approximateQuadraticBezierLength(
        position.xStart,
        position.yStart,
        position.xControl,
        position.yControl,
        position.xEnd,
        position.yEnd,
      );
      this.context.beginPath();
      this.context.moveTo(position.xStart, position.yStart);
      this.context.quadraticCurveTo(
        position.xControl,
        position.yControl,
        position.xEnd,
        position.yEnd,
      );
      this.context.setLineDash([]);
      // if (isDashed) {
      // this.context.setLineDash([10, 5]);
      // }
      this.context.stroke();
    }

    /** Particle */
    if (this.linkSettings.particles && (currentLinkHighlighted || currentNodeHighlighted)) {
      const particleCount = Math.max(
        1,
        Math.floor(linkDistance / this.linkSettings.particleCountByDistance),
      );
      const duration = linkDistance / ((1 / this.linkSettings.particleSpeedByDistance) * (1 + 0.5));
      if (!this.particles[index]) {
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
        this.particles[index] = particles;
      }
      const start = this.highlightStart;
      if (start != undefined) {
        this.particles[index].forEach((particle, index) => {
          if (!this.context) return;
          getParticlePosition({
            distance: linkDistance,
            particle,
            index,
            totalCount: particleCount,
            xEnd,
            xStart,
            yEnd,
            yStart,
            xControl,
            yControl,
            duration,
            start,
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
      let angle = 0;
      if (!this.linkSettings.curve) {
        angle = Math.atan2(yEndArrow - yStart, xEndArrow - xStart);
      } else {
        const tangentX = 2 * (xEndArrow - xControl);
        const tangentY = 2 * (yEndArrow - yControl);
        if (Math.abs(tangentX) < 0.001 && Math.abs(tangentY) < 0.001) {
          angle = Math.atan2(yEndArrow - yControl, xEndArrow - xControl);
        } else {
          angle = Math.atan2(tangentY, tangentX);
        }
      }
      this.context.beginPath();
      this.context.globalAlpha = arrowAlpha;
      this.context.strokeStyle = arrowBorderColor;
      this.context.lineWidth = arrowBorderWidth;
      this.context.fillStyle = arrowColor;
      this.context.moveTo(xEndArrow, yEndArrow);
      this.context.lineTo(
        xEndArrow - arrowSize * Math.cos(angle - Math.PI / 6),
        yEndArrow - arrowSize * Math.sin(angle - Math.PI / 6),
      );
      this.context.lineTo(
        xEndArrow - arrowSize * Math.cos(angle + Math.PI / 6),
        yEndArrow - arrowSize * Math.sin(angle + Math.PI / 6),
      );
      this.context.closePath();
      this.context.fill();
      if (arrowBorderWidth > 0) {
        this.context.stroke();
      }
    }

    if (linkOptions.drawExtraLink) {
      linkOptions.drawExtraLink.call(this, link, { ...linkOptions, alpha });
    }
  };
}

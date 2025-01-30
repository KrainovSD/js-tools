import type { LinkData, NodeData } from "@/app/types";
import type { GraphCanvas } from "@/module/GraphCanvas";
import { CONTROLS, FORCE_TYPES, FORCE_USELESS_TYPES } from "./constants";

export function listenForceTools(graph: GraphCanvas<NodeData, LinkData>, updateSingle: boolean) {
  let centralForce: number = 1;
  let linkDistance: number = 30;

  let chargeForce: number = 40;
  let linkForce: number = 1;
  let xForce: number = 0.1;
  let yForce: number = 0.1;
  let radiusCoefficient: number = 5;
  let radiusFactor: number = 1;
  let highlight: boolean = true;

  const forceUseless =
    document.querySelector(`#${CONTROLS.ForceUseless}`)?.querySelectorAll("input") || [];
  const forceMain = document.querySelector(`#${CONTROLS.Force}`)?.querySelectorAll("input") || [];

  [...forceUseless, ...forceMain].forEach?.((input) => {
    input.addEventListener("input", () => {
      switch (input.id) {
        case FORCE_USELESS_TYPES.Center: {
          centralForce = +input.value;
          if (updateSingle)
            graph.changeSettings({
              forceSettings: {
                centerStrength: centralForce,
              },
            });
          break;
        }
        case FORCE_USELESS_TYPES.LinkForce: {
          linkForce = +input.value;
          if (updateSingle)
            graph.changeSettings({
              forceSettings: {
                linkStrength: linkForce,
              },
            });
          break;
        }
        case FORCE_TYPES.Charge: {
          chargeForce = +input.value;
          if (updateSingle)
            graph.changeSettings({
              forceSettings: {
                chargeStrength: chargeForce * -1,
              },
            });
          break;
        }
        case FORCE_TYPES.LinkDistance: {
          linkDistance = +input.value;
          if (updateSingle)
            graph.changeSettings({
              forceSettings: {
                linkDistance,
              },
            });
          break;
        }
        case FORCE_TYPES.XForce: {
          xForce = +input.value;
          if (updateSingle)
            graph.changeSettings({
              forceSettings: {
                xStrength: xForce,
              },
            });
          break;
        }
        case FORCE_TYPES.YForce: {
          yForce = +input.value;
          if (updateSingle)
            graph.changeSettings({
              forceSettings: {
                yStrength: yForce,
              },
            });
          break;
        }
        case FORCE_TYPES.RadiusCoefficient: {
          radiusCoefficient = +input.value;
          if (updateSingle)
            graph.changeSettings({
              graphSettings: {
                nodeRadiusCoefficient: radiusCoefficient,
              },
            });
          break;
        }
        case FORCE_TYPES.RadiusFactor: {
          radiusFactor = +input.value;
          if (updateSingle)
            graph.changeSettings({
              graphSettings: {
                nodeRadiusFactor: radiusFactor,
              },
            });
          break;
        }
        case FORCE_TYPES.Highlight: {
          highlight = input.checked;
          if (updateSingle)
            graph.changeSettings({
              graphSettings: {
                highlightByHover: highlight,
              },
            });
          break;
        }

        default: {
          break;
        }
      }

      if (!updateSingle)
        graph.changeSettings({
          forceSettings: {
            centerStrength: centralForce,
            chargeStrength: chargeForce * -1,
            linkStrength: linkForce,
            linkDistance,
            xStrength: xForce,
            yStrength: yForce,
          },
          graphSettings: {
            nodeRadiusCoefficient: radiusCoefficient,
            nodeRadiusFactor: radiusFactor,
            highlightByHover: highlight,
          },
        });
    });

    switch (input.id) {
      case FORCE_USELESS_TYPES.Center: {
        input.value = centralForce.toString();
        break;
      }
      case FORCE_USELESS_TYPES.LinkForce: {
        input.value = linkForce.toString();
        break;
      }
      case FORCE_TYPES.Charge: {
        input.value = chargeForce.toString();
        break;
      }
      case FORCE_TYPES.LinkDistance: {
        input.value = linkDistance.toString();
        break;
      }
      case FORCE_TYPES.XForce: {
        input.value = xForce.toString();
        break;
      }
      case FORCE_TYPES.YForce: {
        input.value = yForce.toString();
        break;
      }
      case FORCE_TYPES.RadiusCoefficient: {
        input.value = radiusCoefficient.toString();
        break;
      }
      case FORCE_TYPES.RadiusFactor: {
        input.value = radiusFactor.toString();
        break;
      }
      case FORCE_TYPES.Highlight: {
        input.checked = highlight;
        break;
      }

      default: {
        break;
      }
    }
  });
}

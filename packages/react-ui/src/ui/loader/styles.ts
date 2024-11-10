import { css } from "@emotion/css";
import { COLORS } from "../../config";

export const styles = {
  back: (zIndex: number) => css`
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: ${zIndex};
    background-color: ${COLORS.greyPrimary50};

    &.full {
      position: fixed;
    }
  `,

  text: css`
    position: absolute;
    font-size: 20px;
    font-weight: 600;
    color: ${COLORS.black};
    top: 50%;
    transform: translateY(200%);
  `,
};

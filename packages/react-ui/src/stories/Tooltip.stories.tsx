import { css } from "@emotion/css";
import type { Meta, StoryFn, StoryObj } from "@storybook/react";
import { Flex, Tooltip } from "../ui";

const meta = {
  title: "Antd/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof Tooltip>;

const button = css`
  border: 1px solid black;
  padding: 2px 4px;
`;

const Template: StoryFn<typeof Tooltip> = () => {
  return (
    <Flex vertical gap={10}>
      <Flex gap={20} align="center" justify="center">
        <Tooltip
          placement="top-left"
          text="Пение весеннее в перелеске. Весенние птичьи трели заросшего сада."
        >
          <div className={button}>LTop</div>
        </Tooltip>
        <Tooltip
          placement="top-center"
          text="Пение весеннее в перелеске. Весенние птичьи трели заросшего сада."
        >
          <div className={button}>Top</div>
        </Tooltip>
        <Tooltip
          placement="top-right"
          text="Пение весеннее в перелеске. Весенние птичьи трели заросшего сада."
        >
          <div className={button}>RTop</div>
        </Tooltip>
      </Flex>
      <Flex gap={250}>
        <Flex vertical gap={20}>
          <Tooltip
            placement="left-top"
            text="Пение весеннее в перелеске. Весенние птичьи трели заросшего сада."
          >
            <div className={button}>TLeft</div>
          </Tooltip>
          <Tooltip
            placement="left-center"
            text="Пение весеннее в перелеске. Весенние птичьи трели заросшего сада."
          >
            <div className={button}>Left</div>
          </Tooltip>
          <Tooltip
            placement="left-bottom"
            text="Пение весеннее в перелеске. Весенние птичьи трели заросшего сада."
          >
            <div className={button}>BLEft</div>
          </Tooltip>
        </Flex>
        <Flex vertical gap={20}>
          <Tooltip
            placement="right-top"
            text="Пение весеннее в перелеске. Весенние птичьи трели заросшего сада."
          >
            <div className={button}>TRight</div>
          </Tooltip>
          <Tooltip
            placement="right-center"
            text="Пение весеннее в перелеске. Весенние птичьи трели заросшего сада."
          >
            <div className={button}>Right</div>
          </Tooltip>
          <Tooltip
            placement="right-bottom"
            text="Пение весеннее в перелеске. Весенние птичьи трели заросшего сада."
          >
            <div className={button}>BRight</div>
          </Tooltip>
        </Flex>
      </Flex>
      <Flex gap={20} align="center" justify="center">
        <Tooltip
          placement="bottom-left"
          text="Пение весеннее в перелеске. Весенние птичьи трели заросшего сада."
        >
          <div className={button}>LBottom</div>
        </Tooltip>
        <Tooltip
          placement="bottom-center"
          text="Пение весеннее в перелеске. Весенние птичьи трели заросшего сада."
        >
          <div className={button}>Bottom</div>
        </Tooltip>
        <Tooltip
          placement="bottom-right"
          text="Пение весеннее в перелеске. Весенние птичьи трели заросшего сада."
        >
          <div className={button}>RBottom</div>
        </Tooltip>
      </Flex>
    </Flex>
  );
};

export const Primary: Story = {
  render: Template,
  args: {},
};

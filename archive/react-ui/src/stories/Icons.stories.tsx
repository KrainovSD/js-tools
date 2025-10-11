import { Icon, type IconName, Icons } from "@krainovsd/react-icons";
import type { Meta, StoryFn, StoryObj } from "@storybook/react";
import React from "react";
import { Button, Flex, Search } from "../ui";

const meta = {
  title: "Antd/Icons",
  component: Icon,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
  args: {},
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof Icon>;

const Template: StoryFn<typeof Icon> = () => {
  const [search, setSearch] = React.useState("");

  return (
    <Flex
      style={{ overflow: "hidden", height: "90vh", maxWidth: "1000px", width: "100vw" }}
      vertical
      gap={20}
    >
      <Search search={search} setSearch={setSearch} label="Поиск по иконкам" />
      <Flex wide wrap gap={10} style={{ overflow: "auto" }}>
        {Object.keys(Icons).map((name) => {
          if (
            search.trim().length > 0 &&
            !name.trim().toLowerCase().includes(search.trim().toLowerCase())
          )
            return null;

          return (
            <Button key={name} onClick={() => copyToClipboard(name)}>
              <Icon icon={name as IconName} size={20} />
              {name}
            </Button>
          );
        })}
      </Flex>
    </Flex>
  );
};

export const Primary: Story = {
  render: Template,
  args: {},
};

export function copyToClipboard(text: string) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);

    return;
  }

  void navigator.clipboard.writeText(text);
}

function fallbackCopyTextToClipboard(text: string) {
  const textArea = document.createElement("textarea");
  textArea.value = text;

  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    document.execCommand("copy");
  } catch {}

  document.body.removeChild(textArea);
}

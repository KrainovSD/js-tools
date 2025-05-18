import type { Meta, StoryFn, StoryObj } from "@storybook/vue3";
import { h } from "vue";
import SettingsFilled from "../icons/SettingsFilled.vue";
import Button from "../ui/Button.vue";
import Flex from "../ui/Flex.vue";

const meta = {
  title: "Example/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof Button> = (args) => ({
  components: { Button },
  setup() {
    return { args };
  },
  render: () => h(Button, { ...args }, { default: () => "Кнопка" }),
});

export const Primary = Template.bind({});
Primary.args = {
  type: "primary",
};

export const Custom: Story = {
  render: (args) => ({
    components: { Button },
    setup() {
      function onClick() {
        // eslint-disable-next-line no-console
        console.log("click");
      }

      return { args, onClick };
    },
    template: /* html */ `
      <div>
        <Button v-bind="args" @click="onClick">
          Кнопка
        </Button>
      </div>
    `,
  }),
  args: {},
};

export const AllInOne: Story = {
  render: (args) => ({
    components: { Button, Flex, SettingsFilled },
    setup() {
      function onClick() {
        // eslint-disable-next-line no-console
        console.log("click");
      }

      return { args, onClick };
    },
    template: /* html */ `
      <Flex w-full h-full overflow="hidden" :gap="10">
    <Flex class="one" :gap="10" vertical>
      <Flex :gap="10">
        <Button size="small">Small</Button>
        <Button size="default">Default</Button>
        <Button size="large">Large</Button>
      </Flex>
      <Flex :gap="10">
        <Button size="small" type="primary">Small</Button>
        <Button size="default" type="primary">Default</Button>
        <Button size="large" type="primary">Large</Button>
      </Flex>
      <Flex :gap="10">
        <Button size="small" type="text">Small</Button>
        <Button size="default" type="text">Default</Button>
        <Button size="large" type="text">Large</Button>
      </Flex>
      <Flex :gap="10">
        <Button size="small" type="link">Small</Button>
        <Button size="default" type="link">Default</Button>
        <Button size="large" type="link">Large</Button>
      </Flex>
      <Flex :gap="10">
        <Button size="small" type="dashed">Small</Button>
        <Button size="default" type="dashed">Default</Button>
        <Button size="large" type="dashed">Large</Button>
      </Flex>
      <Flex :gap="10">
        <Button size="small" danger>Small</Button>
        <Button size="default" danger>Default</Button>
        <Button size="large" danger>Large</Button>
      </Flex>
      <Flex :gap="10">
        <Button size="small" type="primary" danger>Small</Button>
        <Button size="default" type="primary" danger>Default</Button>
        <Button size="large" type="primary" danger>Large</Button>
      </Flex>
      <Flex :gap="10">
        <Button size="small" type="text" danger>Small</Button>
        <Button size="default" type="text" danger>Default</Button>
        <Button size="large" type="text" danger>Large</Button>
      </Flex>
      <Flex :gap="10">
        <Button size="small" type="link" danger>Small</Button>
        <Button size="default" type="link" danger>Default</Button>
        <Button size="large" type="link" danger>Large</Button>
      </Flex>
      <Flex :gap="10">
        <Button size="small" type="dashed" danger>Small</Button>
        <Button size="default" type="dashed" danger>Default</Button>
        <Button size="large" type="dashed" danger>Large</Button>
      </Flex>
      <Flex vertical :gap="10" style="background-color: rgb(190, 200, 200); padding: 20px">
        <Flex :gap="10">
          <Button size="small" ghost>Small</Button>
          <Button size="default" ghost>Default</Button>
          <Button size="large" ghost>Large</Button>
        </Flex>
        <Flex :gap="10">
          <Button size="small" type="primary" ghost>Small</Button>
          <Button size="default" type="primary" ghost>Default</Button>
          <Button size="large" type="primary" ghost>Large</Button>
        </Flex>
        <Flex :gap="10">
          <Button size="small" type="dashed" ghost>Small</Button>
          <Button size="default" type="dashed" ghost>Default</Button>
          <Button size="large" type="dashed" ghost>Large</Button>
        </Flex>
      </Flex>
    </Flex>
    <Flex class="two" :gap="10" vertical>
      <Flex :gap="10">
        <Button disabled size="small">Small</Button>
        <Button disabled size="default">Default</Button>
        <Button disabled size="large">Large</Button>
      </Flex>
      <Flex :gap="10">
        <Button disabled size="small" type="primary">Small</Button>
        <Button disabled size="default" type="primary">Default</Button>
        <Button disabled size="large" type="primary">Large</Button>
      </Flex>
      <Flex :gap="10">
        <Button disabled size="small" type="text">Small</Button>
        <Button disabled size="default" type="text">Default</Button>
        <Button disabled size="large" type="text">Large</Button>
      </Flex>
      <Flex :gap="10">
        <Button disabled size="small" type="link">Small</Button>
        <Button disabled size="default" type="link">Default</Button>
        <Button disabled size="large" type="link">Large</Button>
      </Flex>
      <Flex :gap="10">
        <Button disabled size="small" type="dashed">Small</Button>
        <Button disabled size="default" type="dashed">Default</Button>
        <Button disabled size="large" type="dashed">Large</Button>
      </Flex>
      <Flex :gap="10">
        <Button disabled size="small" danger>Small</Button>
        <Button disabled size="default" danger>Default</Button>
        <Button disabled size="large" danger>Large</Button>
      </Flex>
      <Flex :gap="10">
        <Button disabled size="small" type="primary" danger>Small</Button>
        <Button disabled size="default" type="primary" danger>Default</Button>
        <Button disabled size="large" type="primary" danger>Large</Button>
      </Flex>
      <Flex :gap="10">
        <Button disabled size="small" type="text" danger>Small</Button>
        <Button disabled size="default" type="text" danger>Default</Button>
        <Button disabled size="large" type="text" danger>Large</Button>
      </Flex>
      <Flex :gap="10">
        <Button disabled size="small" type="link" danger>Small</Button>
        <Button disabled size="default" type="link" danger>Default</Button>
        <Button disabled size="large" type="link" danger>Large</Button>
      </Flex>
      <Flex :gap="10">
        <Button disabled size="small" type="dashed" danger>Small</Button>
        <Button disabled size="default" type="dashed" danger>Default</Button>
        <Button disabled size="large" type="dashed" danger>Large</Button>
      </Flex>
      <Flex vertical :gap="10" style="background-color: rgb(190, 200, 200); padding: 20px">
        <Flex :gap="10">
          <Button disabled size="small" ghost>Small</Button>
          <Button disabled size="default" ghost>Default</Button>
          <Button disabled size="large" ghost>Large</Button>
        </Flex>
        <Flex :gap="10">
          <Button disabled size="small" type="primary" ghost>Small</Button>
          <Button disabled size="default" type="primary" ghost>Default</Button>
          <Button disabled size="large" type="primary" ghost>Large</Button>
        </Flex>
        <Flex :gap="10">
          <Button disabled size="small" type="dashed" ghost>Small</Button>
          <Button disabled size="default" type="dashed" ghost>Default</Button>
          <Button disabled size="large" type="dashed" ghost>Large</Button>
        </Flex>
      </Flex>
    </Flex>
    <Flex class="three" :gap="10" vertical>
      <Flex :gap="10">
        <Button loading shape="circle"
          ><template #icon><SettingsFilled :size="14" /></template
        ></Button>
        <Button loading shape="round"
          ><template #icon><SettingsFilled :size="14" /></template
        ></Button>
        <Button loading
          ><template #icon><SettingsFilled :size="14" /></template
        ></Button>
        <Button loading size="default"
          ><template #icon><SettingsFilled :size="14" /></template> Default</Button
        >
        <Button loading shape="round">Large</Button>
      </Flex>
      <Flex :gap="10">
        <Button loading shape="circle" type="primary"
          ><template #icon><SettingsFilled :size="14" /></template
        ></Button>
        <Button loading size="default" type="primary">Default</Button>
        <Button loading size="default" type="primary" icon-position="right"
          ><template #icon><SettingsFilled :size="14" /></template> Default</Button
        >
        <Button loading shape="round" type="primary">Large</Button>
      </Flex>
      <Flex :gap="10">
        <Button loading shape="circle" type="text"
          ><template #icon><SettingsFilled :size="14" /></template
        ></Button>
        <Button loading size="default" type="text">Default</Button>
        <Button loading shape="round" type="text">Large</Button>
      </Flex>
      <Flex :gap="10">
        <Button loading shape="circle" type="link"
          ><template #icon><SettingsFilled :size="14" /></template
        ></Button>
        <Button loading size="default" type="link">Default</Button>
        <Button loading shape="round" type="link">Large</Button>
      </Flex>
      <Flex :gap="10">
        <Button loading shape="circle" type="dashed"
          ><template #icon><SettingsFilled :size="14" /></template
        ></Button>
        <Button loading size="default" type="dashed">Default</Button>
        <Button loading shape="round" type="dashed">Large</Button>
      </Flex>
      <Flex :gap="10">
        <Button loading shape="circle" danger
          ><template #icon><SettingsFilled :size="14" /></template
        ></Button>
        <Button loading size="default" danger>Default</Button>
        <Button loading shape="round" danger>Large</Button>
      </Flex>
      <Flex :gap="10">
        <Button loading shape="circle" type="primary" danger
          ><template #icon><SettingsFilled :size="14" /></template
        ></Button>
        <Button loading size="default" type="primary" danger>Default</Button>
        <Button loading shape="round" type="primary" danger>Large</Button>
      </Flex>
      <Flex :gap="10">
        <Button loading shape="circle" type="text" danger
          ><template #icon><SettingsFilled :size="14" /></template
        ></Button>
        <Button loading size="default" type="text" danger>Default</Button>
        <Button loading shape="round" type="text" danger>Large</Button>
      </Flex>
      <Flex :gap="10">
        <Button loading shape="circle" type="link" danger
          ><template #icon><SettingsFilled :size="14" /></template
        ></Button>
        <Button loading size="default" type="link" danger>Default</Button>
        <Button loading shape="round" type="link" danger>Large</Button>
      </Flex>
      <Flex :gap="10">
        <Button loading shape="circle" type="dashed" danger
          ><template #icon><SettingsFilled :size="14" /></template
        ></Button>
        <Button loading size="default" type="dashed" danger>Default</Button>
        <Button loading shape="round" type="dashed" danger>Large</Button>
      </Flex>
      <Flex vertical :gap="10" style="background-color: rgb(190, 200, 200); padding: 20px">
        <Flex :gap="10">
          <Button loading shape="circle" ghost
            ><template #icon><SettingsFilled :size="14" /></template
          ></Button>
          <Button loading size="default" ghost>Default</Button>
          <Button loading shape="round" ghost>Large</Button>
        </Flex>
        <Flex :gap="10">
          <Button loading shape="circle" type="primary" ghost
            ><template #icon><SettingsFilled :size="14" /></template
          ></Button>
          <Button loading size="default" type="primary" ghost>Default</Button>
          <Button loading shape="round" type="primary" ghost>Large</Button>
        </Flex>
        <Flex :gap="10">
          <Button loading shape="circle" type="dashed" ghost
            ><template #icon><SettingsFilled :size="14" /></template
          ></Button>
          <Button loading size="default" type="dashed" ghost>Default</Button>
          <Button loading shape="round" type="dashed" ghost>Large</Button>
        </Flex>
      </Flex>
    </Flex>

    <Flex class="four" :gap="10" vertical>
      <Flex :gap="10">
        <Button shape="circle"
          ><template #icon><SettingsFilled :size="14" /></template
        ></Button>
        <Button shape="round"
          ><template #icon><SettingsFilled :size="14" /></template
        ></Button>
        <Button
          ><template #icon><SettingsFilled :size="14" /></template
        ></Button>
        <Button size="default"
          ><template #icon><SettingsFilled :size="14" /></template> Default</Button
        >
        <Button shape="round">Large</Button>
      </Flex>
      <Flex :gap="10">
        <Button shape="circle" type="primary"
          ><template #icon><SettingsFilled :size="14" /></template
        ></Button>
        <Button size="default" type="primary">Default</Button>
        <Button size="default" type="primary" icon-position="right"
          ><template #icon><SettingsFilled :size="14" /></template> Default</Button
        >
        <Button shape="round" type="primary">Large</Button>
      </Flex>
      <Flex :gap="10">
        <Button shape="circle" type="text"
          ><template #icon><SettingsFilled :size="14" /></template
        ></Button>
        <Button size="default" type="text">Default</Button>
        <Button shape="round" type="text">Large</Button>
      </Flex>
      <Flex :gap="10">
        <Button shape="circle" type="link"
          ><template #icon><SettingsFilled :size="14" /></template
        ></Button>
        <Button size="default" type="link">Default</Button>
        <Button shape="round" type="link">Large</Button>
      </Flex>
      <Flex :gap="10">
        <Button shape="circle" type="dashed"
          ><template #icon><SettingsFilled :size="14" /></template
        ></Button>
        <Button size="default" type="dashed">Default</Button>
        <Button shape="round" type="dashed">Large</Button>
      </Flex>
      <Flex :gap="10">
        <Button shape="circle" danger
          ><template #icon><SettingsFilled :size="14" /></template
        ></Button>
        <Button size="default" danger>Default</Button>
        <Button shape="round" danger>Large</Button>
      </Flex>
      <Flex :gap="10">
        <Button shape="circle" type="primary" danger
          ><template #icon><SettingsFilled :size="14" /></template
        ></Button>
        <Button size="default" type="primary" danger>Default</Button>
        <Button shape="round" type="primary" danger>Large</Button>
      </Flex>
      <Flex :gap="10">
        <Button shape="circle" type="text" danger
          ><template #icon><SettingsFilled :size="14" /></template
        ></Button>
        <Button size="default" type="text" danger>Default</Button>
        <Button shape="round" type="text" danger>Large</Button>
      </Flex>
      <Flex :gap="10">
        <Button shape="circle" type="link" danger
          ><template #icon><SettingsFilled :size="14" /></template
        ></Button>
        <Button size="default" type="link" danger>Default</Button>
        <Button shape="round" type="link" danger>Large</Button>
      </Flex>
      <Flex :gap="10">
        <Button shape="circle" type="dashed" danger
          ><template #icon><SettingsFilled :size="14" /></template
        ></Button>
        <Button size="default" type="dashed" danger>Default</Button>
        <Button shape="round" type="dashed" danger>Large</Button>
      </Flex>
      <Flex vertical :gap="10" style="background-color: rgb(190, 200, 200); padding: 20px">
        <Flex :gap="10">
          <Button shape="circle" ghost
            ><template #icon><SettingsFilled :size="14" /></template
          ></Button>
          <Button size="default" ghost>Default</Button>
          <Button shape="round" ghost>Large</Button>
        </Flex>
        <Flex :gap="10">
          <Button shape="circle" type="primary" ghost
            ><template #icon><SettingsFilled :size="14" /></template
          ></Button>
          <Button size="default" type="primary" ghost>Default</Button>
          <Button shape="round" type="primary" ghost>Large</Button>
        </Flex>
        <Flex :gap="10">
          <Button shape="circle" type="dashed" ghost
            ><template #icon><SettingsFilled :size="14" /></template
          ></Button>
          <Button size="default" type="dashed" ghost>Default</Button>
          <Button shape="round" type="dashed" ghost>Large</Button>
        </Flex>
      </Flex>
    </Flex>
    `,
  }),
  args: {},
};

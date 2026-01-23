import type { Meta, StoryFn, StoryObj } from "@storybook/vue3";
import { h, useTemplateRef } from "vue";
import { VFlex, VText, VTooltip } from "../ui";

const meta = {
  title: "Components/Tooltip",
  component: VTooltip,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof VTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof VTooltip> = (args) => ({
  components: { VTooltip },
  setup() {
    return { args };
  },
  render() {
    return h(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          paddingTop: "200px",
          paddingLeft: "200px",
        },
      },
      [
        h(VTooltip, { ...args, placement: "right-bottom", disabled: false }, () =>
          h(VText, { ellipsis: true, fit: true, style: { height: "30px" } }, () => "Навести"),
        ),
      ],
    );
  },
});

export const Primary = Template.bind({});
Primary.args = {
  text: "Большой текст для тестов тултипа, Большой текст для тестов тултипа, Большой текст для тестов тултипа, Большой текст для тестов тултипа, Большой текст для тестов тултипа, Большой текст для тестов тултипа",
};

export const AllInOne: Story = {
  render: (args) => ({
    components: { VTooltip },
    setup() {
      return { args };
    },
    render() {
      return h(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "200vw",
            height: "200vh",
          },
        },
        [
          h(VTooltip, { ...args }, () =>
            h(VText, { ellipsis: true, fit: true }, () => "Обычный тултип"),
          ),
          h(VTooltip, { ...args, openNotVisible: true }, () =>
            h(
              VText,
              { ellipsis: true, fit: true, style: { maxWidth: "100px" } },
              () => "Повляется когда текст не помещается",
            ),
          ),
          h(VTooltip, { ...args, openNotVisible: true }, () =>
            h(VText, { ellipsis: true, fit: true }, () => "Повляется когда текст не помещается"),
          ),
          h(VTooltip, { ...args, openAboveCursor: true }, () =>
            h(VText, { ellipsis: true, fit: true }, () => "Стрелочка под курсором"),
          ),
          h(VTooltip, { ...args, openAboveCursor: true, stickyCursor: true }, () =>
            h(VText, { ellipsis: true, fit: true }, () => "Стрелочка следует за курсором"),
          ),
          h(
            VFlex,
            {
              vertical: true,
              gap: 30,
              style: { marginLeft: "300px", marginTop: "300px", maxWidth: "390px" },
            },
            () => [
              h(VFlex, { gap: 20, flexAlign: "center", justify: "center" }, () => [
                h(VTooltip, { ...args, placement: "top-left" }, () =>
                  h(VText, { ellipsis: true, fit: true }, () => "t-left"),
                ),
                h(VTooltip, { ...args, placement: "top-center" }, () =>
                  h(VText, { ellipsis: true, fit: true }, () => "t-center"),
                ),
                h(VTooltip, { ...args, placement: "top-right" }, () =>
                  h(VText, { ellipsis: true, fit: true }, () => "t-right"),
                ),
              ]),
              h(VFlex, { gap: 280 }, () => [
                h(VFlex, { gap: 20, vertical: true }, () => [
                  h(VTooltip, { ...args, placement: "left-top" }, () =>
                    h(VText, { ellipsis: true, fit: true }, () => "l-top"),
                  ),
                  h(VTooltip, { ...args, placement: "left-center" }, () =>
                    h(VText, { ellipsis: true, fit: true }, () => "l-center"),
                  ),
                  h(VTooltip, { ...args, placement: "left-bottom" }, () =>
                    h(VText, { ellipsis: true, fit: true }, () => "l-bottom"),
                  ),
                ]),
                h(VFlex, { gap: 20, vertical: true }, () => [
                  h(VTooltip, { ...args, placement: "right-top" }, () =>
                    h(VText, { ellipsis: true, fit: true }, () => "r-top"),
                  ),
                  h(VTooltip, { ...args, placement: "right-center" }, () =>
                    h(VText, { ellipsis: true, fit: true }, () => "r-center"),
                  ),
                  h(VTooltip, { ...args, placement: "right-bottom" }, () =>
                    h(VText, { ellipsis: true, fit: true }, () => "r-bottom"),
                  ),
                ]),
              ]),
              h(VFlex, { gap: 20, flexAlign: "center", justify: "center" }, () => [
                h(VTooltip, { ...args, placement: "bottom-left" }, () =>
                  h(VText, { ellipsis: true, fit: true }, () => "b-left"),
                ),
                h(VTooltip, { ...args, placement: "bottom-center" }, () =>
                  h(VText, { ellipsis: true, fit: true }, () => "b-center"),
                ),
                h(VTooltip, { ...args, placement: "bottom-right" }, () =>
                  h(VText, { ellipsis: true, fit: true }, () => "b-right"),
                ),
              ]),
            ],
          ),
        ],
      );
    },
  }),
  args: {
    text: "Большой текст для тестов тултипа, Большой текст для тестов тултипа, Большой текст для тестов тултипа, Большой текст для тестов тултипа",
  },
};

export const PositionCheckInVisibleArea: Story = {
  render: (args) => ({
    components: { VTooltip },
    setup() {
      const div = useTemplateRef("div");

      return { args, div };
    },
    render() {
      return h(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "100%",
            height: "100%",
          },
        },
        [
          h(
            "div",
            {
              ref: "div",
              style: {
                border: "1px solid black",
                minHeight: "300px",
                minWidth: "500px",
                margin: "300px 300px 300px 300px",
                class: "test-tooltip-position",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                gap: "50px",
              },
            },
            [
              h(
                VTooltip,
                {
                  ...args,
                  visibleArea: this.div,
                  placement: "top-center",
                },
                () => h(VText, { ellipsis: true, fit: true }, () => "Tooltip top-center"),
              ),
              h(
                VTooltip,
                {
                  ...args,
                  visibleArea: this.div,
                  placement: "left-center",
                },
                () => h(VText, { ellipsis: true, fit: true }, () => "Tooltip left-center"),
              ),
              h(
                VTooltip,
                {
                  ...args,
                  visibleArea: this.div,
                  placement: "right-top",
                },
                () => h(VText, { ellipsis: true, fit: true }, () => "Tooltip right-top"),
              ),
              h(
                VTooltip,
                {
                  ...args,
                  visibleArea: this.div,
                  placement: "bottom-right",
                },
                () => h(VText, { ellipsis: true, fit: true }, () => "Tooltip bottom-right"),
              ),
            ],
          ),
        ],
      );
    },
  }),
  args: {
    text: "Большой текст для тестов тултипа, Большой текст для тестов тултипа, Большой текст для тестов тултипа, Большой текст для тестов тултипа",
  },
};

export const PositionCheckInVisibleAreaWithScroll: Story = {
  render: (args) => ({
    components: { VTooltip },
    setup() {
      const div = useTemplateRef("div");

      return { args, div };
    },
    render() {
      return h(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "100%",
            height: "100%",
          },
        },
        [
          h(
            "div",
            {
              ref: "div",
              style: {
                border: "1px solid black",
                minHeight: "300px",
                minWidth: "500px",
                margin: "300px 300px 300px 300px",
                class: "test-tooltip-position",
                overflow: "auto",
              },
            },
            [
              h(
                "div",
                {
                  style: {
                    height: "600px",
                    paddingTop: "200px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "50px",
                    position: "relative",
                  },
                },
                [
                  h(
                    VTooltip,
                    {
                      ...args,
                      visibleArea: this.div,
                      placement: "top-center",
                    },
                    () => h(VText, { ellipsis: true, fit: true }, () => "Tooltip top-center"),
                  ),
                  h(
                    VTooltip,
                    {
                      ...args,
                      visibleArea: this.div,
                      placement: "left-center",
                    },
                    () => h(VText, { ellipsis: true, fit: true }, () => "Tooltip left-center"),
                  ),
                  h(
                    VTooltip,
                    {
                      ...args,
                      visibleArea: this.div,
                      placement: "right-top",
                    },
                    () => h(VText, { ellipsis: true, fit: true }, () => "Tooltip right-top"),
                  ),
                  h(
                    VTooltip,
                    {
                      ...args,
                      visibleArea: this.div,
                      placement: "bottom-right",
                    },
                    () => h(VText, { ellipsis: true, fit: true }, () => "Tooltip bottom-right"),
                  ),
                ],
              ),
            ],
          ),
        ],
      );
    },
  }),
  args: {
    text: "Большой текст для тестов тултипа, Большой текст для тестов тултипа, Большой текст для тестов тултипа, Большой текст для тестов тултипа",
  },
};

export const PositionCheckWithScroll: Story = {
  render: (args) => ({
    components: { VTooltip },
    setup() {
      return { args };
    },
    render() {
      return h(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "100%",
            height: "100%",
          },
        },
        [
          h(
            "div",
            {
              ref: "div",
              style: {
                border: "1px solid black",
                minHeight: "300px",
                minWidth: "500px",
                margin: "300px 300px 300px 300px",
                class: "test-tooltip-position",
                overflow: "auto",
              },
            },
            [
              h(
                "div",
                {
                  style: {
                    minHeight: "600px",
                    paddingTop: "200px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "50px",
                    position: "relative",
                  },
                },
                [
                  h(
                    VTooltip,
                    {
                      ...args,
                      placement: "top-center",
                    },
                    () => h(VText, { ellipsis: true, fit: true }, () => "Tooltip top-center"),
                  ),
                  h(
                    VTooltip,
                    {
                      ...args,
                      placement: "left-center",
                    },
                    () => h(VText, { ellipsis: true, fit: true }, () => "Tooltip left-center"),
                  ),
                  h(
                    VTooltip,
                    {
                      ...args,
                      placement: "right-top",
                    },
                    () => h(VText, { ellipsis: true, fit: true }, () => "Tooltip right-top"),
                  ),
                  h(
                    VTooltip,
                    {
                      ...args,
                      placement: "bottom-right",
                    },
                    () => h(VText, { ellipsis: true, fit: true }, () => "Tooltip bottom-right"),
                  ),
                ],
              ),
            ],
          ),
        ],
      );
    },
  }),
  args: {
    text: "Большой текст для тестов тултипа, Большой текст для тестов тултипа, Большой текст для тестов тултипа, Большой текст для тестов тултипа",
  },
};

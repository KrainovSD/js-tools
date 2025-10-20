import { VSettingFilled } from "@krainovsd/vue-icons";
import { h } from "vue";
import { type SelectItem, VText } from "../../ui";

export const SELECT_MOCK: SelectItem<number>[] = [
  { value: 1, label: "Значение 1" },
  { value: 2, label: "Значение 2" },
  { value: 3, label: "Значение 3" },
  { value: 4, label: "Очень Длинное значение для проверки размеров у селектов 4" },
  {
    value: 5,
    label: "Значение 5",
    desc: h("div", { style: { display: "flex", gap: "10px", alignItems: "center" } }, [
      h(VSettingFilled, { size: 14 }),
      h(VText, {}, () => "Особое значение 5"),
    ]),
  },
];

<script setup lang="ts">
  import { randomString } from "@krainovsd/js-helpers";
  import { VLoginOutlined } from "@krainovsd/vue-icons";
  import { computed, h, markRaw, nextTick, ref, useTemplateRef } from "vue";
  import { type DropDownMenuItem, VButton } from "../../ui";
  import DropDown from "../../ui/DropDown.vue";
  import UserInfo from "../../ui/UserInfo.vue";

  const name = ref(randomString(8));
  const dropDownRef = useTemplateRef("drop");

  function changeName() {
    name.value = randomString(8);
    void nextTick(() => {
      dropDownRef.value?.popper?.updateTargetNode();
    });
  }

  const icon = markRaw(h(VLoginOutlined));

  const menu = computed<DropDownMenuItem[]>(() => [
    { key: "1", label: name.value, noInteractive: true },
    { key: "2", divider: true },
    {
      key: "3",
      label: "test",
      icon,
      onClick: () => changeName(),
    },
  ]);
</script>

<template>
  <div>
    <DropDown ref="drop" :menu="menu">
      <UserInfo :key="name" :username="name" :name="name" :size="'large'" :avatar="undefined" />
    </DropDown>
    <VButton @click="changeName">Change</VButton>
  </div>
</template>

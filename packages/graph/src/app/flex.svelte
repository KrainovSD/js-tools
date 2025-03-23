<script lang="ts">
  import type { SvelteHTMLElements } from "svelte/elements";
  import styles from "./flex.module.scss";

  type Props = {
    instance?: HTMLDivElement;
    vertical?: boolean;
    wide?: boolean;
    full?: boolean;
    gap?: number;
    align?: "center" | "end" | "start" | "flex-end" | "flex-start";
    justify?:
      | "center"
      | "end"
      | "start"
      | "flex-end"
      | "flex-start"
      | "space-between"
      | "space-around";
  };

  let {
    children,
    vertical,
    wide,
    full,
    gap,
    align,
    justify,
    instance = $bindable(),
    onclick,
    ...rest
  }: SvelteHTMLElements["div"] & Props = $props();
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex it is lie -->
<div
  {...rest}
  class={[
    styles.flex,
    wide && styles.wide,
    full && styles.full,
    vertical && styles.vertical,
    rest.class,
  ]}
  style:gap={gap + "px"}
  style:align-items={align}
  style:justify-content={justify}
  bind:this={instance}
  {onclick}
  onkeydown={(event) => {
    if (onclick && event.key === "Enter" && instance) instance.click();
  }}
  role={onclick ? "button" : undefined}
  tabindex={onclick ? 0 : null}
>
  {@render children?.()}
</div>

import { defineComponent, type Component } from "vue";

export const X: Component = defineComponent({
  name: "X",
  template: '<svg data-testid="x-icon"></svg>',
  props: {
    size: { type: Number, default: 16 },
  },
});

export const Heart: Component = defineComponent({
  name: "Heart",
  template: '<svg data-testid="heart-icon"></svg>',
  props: {
    size: { type: Number, default: 24 },
    fill: { type: String, default: "none" },
    color: { type: String, default: "#6b7280" },
  },
});

import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Text from "./Text.vue";
import type { TextProps } from "./types";

describe("Text", () => {
  describe("Default Props", () => {
    it("renders with default props", () => {
      const wrapper = mount(Text, {
        slots: {
          default: "Test content",
        },
      });

      expect(wrapper.html()).toContain("Test content");
      expect(wrapper.element.tagName.toLowerCase()).toBe("p");
    });

    it("applies default classes", () => {
      const wrapper = mount(Text, {
        slots: {
          default: "Test",
        },
      });

      const classes = wrapper.classes();
      expect(classes).toContain("text-base");
      expect(classes).toContain("font-normal");
      expect(classes).toContain("text-gray-900");
      expect(classes).toContain("text-left");
    });
  });

  describe("Tag Prop", () => {
    it.each([
      ["h1", "h1"],
      ["h2", "h2"],
      ["h3", "h3"],
      ["h4", "h4"],
      ["h5", "h5"],
      ["h6", "h6"],
      ["p", "p"],
      ["span", "span"],
      ["div", "div"],
      ["label", "label"],
    ])("renders as %s tag when tag prop is %s", (tag, expectedTag) => {
      const wrapper = mount(Text, {
        props: {
          tag: tag as TextProps["tag"],
        },
        slots: {
          default: "Test",
        },
      });

      expect(wrapper.element.tagName.toLowerCase()).toBe(expectedTag);
    });
  });

  describe("Size Prop", () => {
    it.each([
      ["xs", "text-xs"],
      ["sm", "text-sm"],
      ["base", "text-base"],
      ["lg", "text-lg"],
      ["xl", "text-xl"],
      ["2xl", "text-2xl"],
      ["3xl", "text-3xl"],
      ["4xl", "text-4xl"],
    ])("applies %s size class when size prop is %s", (size, expectedClass) => {
      const wrapper = mount(Text, {
        props: {
          size: size as TextProps["size"],
        },
        slots: {
          default: "Test",
        },
      });

      expect(wrapper.classes()).toContain(expectedClass);
    });
  });

  describe("Weight Prop", () => {
    it.each([
      ["thin", "font-thin"],
      ["normal", "font-normal"],
      ["medium", "font-medium"],
      ["semibold", "font-semibold"],
      ["bold", "font-bold"],
      ["extrabold", "font-extrabold"],
    ])(
      "applies %s weight class when weight prop is %s",
      (weight, expectedClass) => {
        const wrapper = mount(Text, {
          props: {
            weight: weight as TextProps["weight"],
          },
          slots: {
            default: "Test",
          },
        });

        expect(wrapper.classes()).toContain(expectedClass);
      }
    );
  });

  describe("Color Prop", () => {
    it.each([
      ["default", "text-gray-900"],
      ["primary", "text-indigo-600"],
      ["secondary", "text-gray-600"],
      ["success", "text-green-600"],
      ["warning", "text-yellow-600"],
      ["error", "text-red-600"],
      ["muted", "text-gray-500"],
    ])(
      "applies %s color class when color prop is %s",
      (color, expectedClass) => {
        const wrapper = mount(Text, {
          props: {
            color: color as TextProps["color"],
          },
          slots: {
            default: "Test",
          },
        });

        expect(wrapper.classes()).toContain(expectedClass);
      }
    );
  });

  describe("Align Prop", () => {
    it.each([
      ["left", "text-left"],
      ["center", "text-center"],
      ["right", "text-right"],
      ["justify", "text-justify"],
    ])(
      "applies %s align class when align prop is %s",
      (align, expectedClass) => {
        const wrapper = mount(Text, {
          props: {
            align: align as TextProps["align"],
          },
          slots: {
            default: "Test",
          },
        });

        expect(wrapper.classes()).toContain(expectedClass);
      }
    );
  });

  describe("Truncate Prop", () => {
    it("applies truncate class when truncate prop is true", () => {
      const wrapper = mount(Text, {
        props: {
          truncate: true,
        },
        slots: {
          default: "Test",
        },
      });

      expect(wrapper.classes()).toContain("truncate");
    });

    it("does not apply truncate class when truncate prop is false", () => {
      const wrapper = mount(Text, {
        props: {
          truncate: false,
        },
        slots: {
          default: "Test",
        },
      });

      expect(wrapper.classes()).not.toContain("truncate");
    });
  });

  describe("Slot Content", () => {
    it("renders slot content", () => {
      const wrapper = mount(Text, {
        slots: {
          default: "Hello World",
        },
      });

      expect(wrapper.text()).toBe("Hello World");
    });

    it("renders complex slot content", () => {
      const wrapper = mount(Text, {
        slots: {
          default: "<strong>Bold</strong> text",
        },
      });

      expect(wrapper.html()).toContain("<strong>Bold</strong> text");
    });
  });

  describe("Class Merging", () => {
    it("merges custom classes with component classes", () => {
      const wrapper = mount(Text, {
        props: {
          size: "lg",
          weight: "bold",
        },
        attrs: {
          class: "custom-class another-class",
        },
        slots: {
          default: "Test",
        },
      });

      const classes = wrapper.classes();
      expect(classes).toContain("text-lg");
      expect(classes).toContain("font-bold");
      expect(classes).toContain("custom-class");
      expect(classes).toContain("another-class");
    });

    it("handles array of classes", () => {
      const wrapper = mount(Text, {
        props: {
          size: "base",
        },
        attrs: {
          class: ["class1", "class2"],
        },
        slots: {
          default: "Test",
        },
      });

      const classes = wrapper.classes();
      expect(classes).toContain("text-base");
    });
  });

  describe("Attribute Forwarding", () => {
    it("forwards non-class attributes", () => {
      const wrapper = mount(Text, {
        attrs: {
          id: "test-id",
          "data-test": "test-value",
          "aria-label": "Test label",
        },
        slots: {
          default: "Test",
        },
      });

      expect(wrapper.attributes("id")).toBe("test-id");
      expect(wrapper.attributes("data-test")).toBe("test-value");
      expect(wrapper.attributes("aria-label")).toBe("Test label");
    });

    it("does not forward class attribute separately", () => {
      const wrapper = mount(Text, {
        props: {
          size: "lg",
        },
        attrs: {
          class: "external-class",
        },
        slots: {
          default: "Test",
        },
      });

      // Class should be merged, not duplicated
      const classAttr = wrapper.attributes("class");
      expect(classAttr).toBeDefined();
      expect(classAttr).toContain("text-lg");
      expect(classAttr).toContain("external-class");
    });
  });

  describe("Prop Combinations", () => {
    it("applies multiple props correctly", () => {
      const wrapper = mount(Text, {
        props: {
          tag: "h1",
          size: "2xl",
          weight: "bold",
          color: "primary",
          align: "center",
          truncate: true,
        },
        slots: {
          default: "Test",
        },
      });

      expect(wrapper.element.tagName.toLowerCase()).toBe("h1");
      const classes = wrapper.classes();
      expect(classes).toContain("text-2xl");
      expect(classes).toContain("font-bold");
      expect(classes).toContain("text-indigo-600");
      expect(classes).toContain("text-center");
      expect(classes).toContain("truncate");
    });
  });
});


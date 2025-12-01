import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from "@jest/globals";
import { mount } from "@vue/test-utils";
import Text from "./Text.vue";
import type { TextProps } from "./types";

describe("Text", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders as paragraph by default", () => {
    const wrapper = mount(Text, {
      props: {},
    });

    expect(wrapper.element.tagName.toLowerCase()).toBe("p");
  });

  it("renders with text prop", () => {
    const props: TextProps = {
      text: "Hello World",
    };

    const wrapper = mount(Text, {
      props,
    });

    expect(wrapper.text()).toBe("Hello World");
  });

  it("renders slot content when provided", () => {
    const wrapper = mount(Text, {
      props: {
        text: "Default text",
      },
      slots: {
        default: "Slot content",
      },
    });

    expect(wrapper.text()).toBe("Slot content");
  });

  it("renders default text when no slot provided", () => {
    const wrapper = mount(Text, {
      props: {
        text: "Default text",
      },
    });

    expect(wrapper.text()).toBe("Default text");
  });

  it("renders empty when neither text nor slot provided", () => {
    const wrapper = mount(Text, {
      props: {},
    });

    expect(wrapper.text()).toBe("");
  });

  it("renders as custom tag", () => {
    const props: TextProps = {
      as: "h1",
      text: "Heading",
    };

    const wrapper = mount(Text, {
      props,
    });

    expect(wrapper.element.tagName.toLowerCase()).toBe("h1");
  });

  it("renders all supported tags", () => {
    const tags: Array<TextProps["as"]> = [
      "p",
      "span",
      "div",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
    ];

    tags.forEach((tag) => {
      const wrapper = mount(Text, {
        props: {
          as: tag,
          text: "Test",
        },
      });

      expect(wrapper.element.tagName.toLowerCase()).toBe(tag);
    });
  });

  it("applies correct size classes", () => {
    const sizes: TextProps["size"][] = [
      "xs",
      "sm",
      "base",
      "lg",
      "xl",
      "2xl",
    ];

    sizes.forEach((size) => {
      const wrapper = mount(Text, {
        props: {
          size,
          text: "Test",
        },
      });

      const classes = wrapper.classes();
      expect(classes.some((cls) => cls.includes(`text-${size}`))).toBe(true);
    });
  });

  it("applies correct weight classes", () => {
    const weights: TextProps["weight"][] = [
      "normal",
      "medium",
      "semibold",
      "bold",
    ];

    weights.forEach((weight) => {
      const wrapper = mount(Text, {
        props: {
          weight,
          text: "Test",
        },
      });

      const classes = wrapper.classes();
      expect(classes.some((cls) => cls.includes(`font-${weight}`))).toBe(true);
    });
  });

  it("uses default size and weight", () => {
    const wrapper = mount(Text, {
      props: {
        text: "Test",
      },
    });

    const classes = wrapper.classes();
    expect(classes.some((cls) => cls.includes("text-base"))).toBe(true);
    expect(classes.some((cls) => cls.includes("font-normal"))).toBe(true);
  });

  it("merges user-provided classes", () => {
    const wrapper = mount(Text, {
      props: {
        text: "Test",
      },
      attrs: {
        class: "custom-class another-class",
      },
    });

    const classes = wrapper.classes();
    expect(classes).toContain("custom-class");
    expect(classes).toContain("another-class");
  });

  it("forwards attributes to element", () => {
    const wrapper = mount(Text, {
      props: {
        text: "Test",
      },
      attrs: {
        "data-testid": "test-text",
        "aria-label": "Test label",
        id: "test-id",
      },
    });

    expect(wrapper.attributes("data-testid")).toBe("test-text");
    expect(wrapper.attributes("aria-label")).toBe("Test label");
    expect(wrapper.attributes("id")).toBe("test-id");
  });

  it("handles all size and weight combinations", () => {
    const sizes: TextProps["size"][] = ["xs", "sm", "base", "lg", "xl", "2xl"];
    const weights: TextProps["weight"][] = [
      "normal",
      "medium",
      "semibold",
      "bold",
    ];

    sizes.forEach((size) => {
      weights.forEach((weight) => {
        const wrapper = mount(Text, {
          props: {
            size,
            weight,
            text: "Test",
          },
        });

        expect(wrapper.exists()).toBe(true);
        expect(wrapper.text()).toBe("Test");
      });
    });
  });
});


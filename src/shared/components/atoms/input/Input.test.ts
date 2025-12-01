import {
  describe,
  it,
  expect,
  jest,
  beforeEach,
  afterEach,
} from "@jest/globals";
import { mount } from "@vue/test-utils";
import Input from "./Input.vue";
import type { InputProps } from "./types";

describe("Input", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders input element with default props", () => {
    const wrapper = mount(Input, {
      props: {},
    });

    const input = wrapper.find("input");
    expect(input.exists()).toBe(true);
    expect(input.attributes("type")).toBe("text");
    expect(input.attributes("placeholder")).toBe("");
    expect(input.attributes("disabled")).toBeUndefined();
  });

  it("renders with custom props", () => {
    const props: InputProps = {
      type: "search",
      modelValue: "test value",
      placeholder: "Search...",
      disabled: true,
    };

    const wrapper = mount(Input, {
      props,
    });

    const input = wrapper.find("input");
    expect(input.attributes("type")).toBe("search");
    expect(input.element.value).toBe("test value");
    expect(input.attributes("placeholder")).toBe("Search...");
    expect(input.attributes("disabled")).toBeDefined();
  });

  it("emits update:modelValue on input", async () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: "",
      },
    });

    const input = wrapper.find("input");
    await input.setValue("new value");

    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["new value"]);
  });

  it("emits focus event", async () => {
    const wrapper = mount(Input);

    const input = wrapper.find("input");
    await input.trigger("focus");

    expect(wrapper.emitted("focus")).toBeTruthy();
    expect(wrapper.emitted("focus")?.[0]?.[0]).toBeInstanceOf(FocusEvent);
  });

  it("emits blur event", async () => {
    const wrapper = mount(Input);

    const input = wrapper.find("input");
    await input.trigger("blur");

    expect(wrapper.emitted("blur")).toBeTruthy();
    expect(wrapper.emitted("blur")?.[0]?.[0]).toBeInstanceOf(FocusEvent);
  });

  it("shows clear button for search type when value exists", () => {
    const wrapper = mount(Input, {
      props: {
        type: "search",
        modelValue: "test",
      },
    });

    const clearButton = wrapper.find(".input__clear");
    expect(clearButton.exists()).toBe(true);
    expect(clearButton.attributes("aria-label")).toBe("Clear input");
  });

  it("hides clear button for search type when value is empty", () => {
    const wrapper = mount(Input, {
      props: {
        type: "search",
        modelValue: "",
      },
    });

    const clearButton = wrapper.find(".input__clear");
    expect(clearButton.exists()).toBe(false);
  });

  it("hides clear button for text type", () => {
    const wrapper = mount(Input, {
      props: {
        type: "text",
        modelValue: "test",
      },
    });

    const clearButton = wrapper.find(".input__clear");
    expect(clearButton.exists()).toBe(false);
  });

  it("clears value when clear button is clicked", async () => {
    const wrapper = mount(Input, {
      props: {
        type: "search",
        modelValue: "test",
      },
    });

    const clearButton = wrapper.find(".input__clear");
    await clearButton.trigger("click");

    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([""]);
  });

  it("applies correct CSS classes", () => {
    const wrapper = mount(Input, {
      props: {
        type: "search",
      },
    });

    const input = wrapper.find("input");
    expect(input.classes()).toContain("input");
    expect(input.classes()).toContain("input--search");
  });

  it("forwards attributes to input element", () => {
    const wrapper = mount(Input, {
      attrs: {
        "data-testid": "test-input",
        "aria-label": "Test input",
      },
    });

    const input = wrapper.find("input");
    expect(input.attributes("data-testid")).toBe("test-input");
    expect(input.attributes("aria-label")).toBe("Test input");
  });

  it("handles v-model binding", async () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: "initial",
      },
    });

    const input = wrapper.find("input");
    expect(input.element.value).toBe("initial");

    await input.setValue("updated");
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["updated"]);
  });
});

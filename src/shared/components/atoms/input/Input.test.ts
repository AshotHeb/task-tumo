import { describe, it, expect } from "@jest/globals";
import { mount } from "@vue/test-utils";
import Input from "./Input.vue";

describe("Input", () => {
  it("renders correctly with default props", () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: "",
      },
    });

    const input = wrapper.find("input");
    expect(input.exists()).toBe(true);
    expect(input.attributes("type")).toBe("text");
  });

  it("supports v-model binding", async () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: "test value",
      },
    });

    const input = wrapper.find("input").element as HTMLInputElement;
    expect(input.value).toBe("test value");

    await wrapper.setProps({ modelValue: "new value" });
    expect(input.value).toBe("new value");
  });

  it("emits update:modelValue on input", async () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: "",
      },
    });

    const input = wrapper.find("input");
    await input.setValue("hello");

    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["hello"]);
  });

  it("shows clear button only for search type when there is text", async () => {
    const wrapper = mount(Input, {
      props: {
        type: "search",
        modelValue: "",
      },
    });

    expect(wrapper.find(".input__clear").exists()).toBe(false);

    await wrapper.setProps({ modelValue: "test" });
    expect(wrapper.find(".input__clear").exists()).toBe(true);
  });

  it("does not show clear button for text type", async () => {
    const wrapper = mount(Input, {
      props: {
        type: "text",
        modelValue: "test",
      },
    });

    expect(wrapper.find(".input__clear").exists()).toBe(false);
  });

  it("clears input when clear button is clicked", async () => {
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

  it("applies placeholder correctly", () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: "",
        placeholder: "Enter text...",
      },
    });

    const input = wrapper.find("input");
    expect(input.attributes("placeholder")).toBe("Enter text...");
  });

  it("handles disabled state", () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: "",
        disabled: true,
      },
    });

    const input = wrapper.find("input");
    expect(input.attributes("disabled")).toBeDefined();
  });

  it("forwards HTML attributes", () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: "",
      },
      attrs: {
        id: "test-input",
        "data-testid": "input",
        maxlength: "10",
      },
    });

    const input = wrapper.find("input");
    expect(input.attributes("id")).toBe("test-input");
    expect(input.attributes("data-testid")).toBe("input");
    expect(input.attributes("maxlength")).toBe("10");
  });

  it("emits focus event", async () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: "",
      },
    });

    const input = wrapper.find("input");
    await input.trigger("focus");

    expect(wrapper.emitted("focus")).toBeTruthy();
    expect(wrapper.emitted("focus")?.[0]).toBeTruthy();
  });

  it("emits blur event", async () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: "",
      },
    });

    const input = wrapper.find("input");
    await input.trigger("blur");

    expect(wrapper.emitted("blur")).toBeTruthy();
    expect(wrapper.emitted("blur")?.[0]).toBeTruthy();
  });

  it("applies correct classes based on type", () => {
    const wrapper = mount(Input, {
      props: {
        type: "search",
        modelValue: "",
      },
    });

    const input = wrapper.find("input");
    expect(input.classes()).toContain("input");
    expect(input.classes()).toContain("input--search");
  });
});

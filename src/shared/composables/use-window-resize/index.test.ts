import {
  describe,
  it,
  expect,
  jest,
  beforeEach,
  afterEach,
} from "@jest/globals";
import { mount } from "@vue/test-utils";
import { ref, defineComponent } from "vue";
import { useWindowResize } from "./index";

describe("useWindowResize", () => {
  let handler: ReturnType<typeof jest.fn>;

  beforeEach(() => {
    handler = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("calls handler when window is resized", async () => {
    const TestComponent = defineComponent({
      setup() {
        useWindowResize({
          handler,
        });
      },
      template: "<div>Test</div>",
    });

    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();

    const resizeEvent = new UIEvent("resize", { bubbles: true });
    window.dispatchEvent(resizeEvent);

    await wrapper.vm.$nextTick();

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(expect.any(UIEvent));

    wrapper.unmount();
  });

  it("does not call handler when disabled", async () => {
    const TestComponent = defineComponent({
      setup() {
        useWindowResize({
          handler,
          enabled: false,
        });
      },
      template: "<div>Test</div>",
    });

    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();

    const resizeEvent = new UIEvent("resize", { bubbles: true });
    window.dispatchEvent(resizeEvent);

    await wrapper.vm.$nextTick();

    expect(handler).not.toHaveBeenCalled();

    wrapper.unmount();
  });

  it("does not call handler when enabled ref is false", async () => {
    const enabled = ref(false);

    const TestComponent = defineComponent({
      setup() {
        useWindowResize({
          handler,
          enabled,
        });
        return { enabled };
      },
      template: "<div>Test</div>",
    });

    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();

    const resizeEvent = new UIEvent("resize", { bubbles: true });
    window.dispatchEvent(resizeEvent);

    await wrapper.vm.$nextTick();

    expect(handler).not.toHaveBeenCalled();

    wrapper.unmount();
  });

  it("calls handler when enabled ref changes to true", async () => {
    const enabled = ref(false);

    const TestComponent = defineComponent({
      setup() {
        useWindowResize({
          handler,
          enabled,
        });
        return { enabled };
      },
      template: "<div>Test</div>",
    });

    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();

    // First resize while disabled
    const resizeEvent1 = new UIEvent("resize", { bubbles: true });
    window.dispatchEvent(resizeEvent1);
    await wrapper.vm.$nextTick();

    expect(handler).not.toHaveBeenCalled();

    // Enable and resize again
    enabled.value = true;
    await wrapper.vm.$nextTick();

    const resizeEvent2 = new UIEvent("resize", { bubbles: true });
    window.dispatchEvent(resizeEvent2);
    await wrapper.vm.$nextTick();

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(expect.any(UIEvent));

    wrapper.unmount();
  });

  it("removes event listener on unmount", async () => {
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

    const TestComponent = defineComponent({
      setup() {
        useWindowResize({
          handler,
        });
      },
      template: "<div>Test</div>",
    });

    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();

    wrapper.unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "resize",
      expect.any(Function)
    );

    removeEventListenerSpy.mockRestore();
  });
});


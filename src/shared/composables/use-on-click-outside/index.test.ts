import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { ref, defineComponent } from "vue";
import { useOnClickOutside } from "./index";

describe("useOnClickOutside", () => {
  let handler: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    handler = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("calls handler when clicking outside the element", async () => {
    const elementRef = ref<HTMLDivElement | null>(null);
    const TestComponent = defineComponent({
      setup() {
        useOnClickOutside({
          elementRef,
          handler,
        });
        return { elementRef };
      },
      template: '<div ref="elementRef" data-testid="target">Target</div>',
    });

    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();

    const targetElement = wrapper.find('[data-testid="target"]').element;
    elementRef.value = targetElement as HTMLDivElement;

    const outsideElement = document.createElement("div");
    document.body.appendChild(outsideElement);

    const event = new MouseEvent("mousedown", { bubbles: true });
    outsideElement.dispatchEvent(event);

    await wrapper.vm.$nextTick();

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(expect.any(MouseEvent));

    document.body.removeChild(outsideElement);
    wrapper.unmount();
  });

  it("does not call handler when clicking inside the element", async () => {
    const elementRef = ref<HTMLDivElement | null>(null);
    const TestComponent = defineComponent({
      setup() {
        useOnClickOutside({
          elementRef,
          handler,
        });
        return { elementRef };
      },
      template: '<div ref="elementRef" data-testid="target">Target</div>',
    });

    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();

    const targetElement = wrapper.find('[data-testid="target"]').element;
    elementRef.value = targetElement as HTMLDivElement;

    const insideElement = document.createElement("span");
    targetElement.appendChild(insideElement);

    const event = new MouseEvent("mousedown", { bubbles: true });
    insideElement.dispatchEvent(event);

    await wrapper.vm.$nextTick();

    expect(handler).not.toHaveBeenCalled();

    wrapper.unmount();
  });

  it("does not call handler when enabled is false (boolean)", async () => {
    const elementRef = ref<HTMLDivElement | null>(null);
    const TestComponent = defineComponent({
      setup() {
        useOnClickOutside({
          elementRef,
          handler,
          enabled: false,
        });
        return { elementRef };
      },
      template: '<div ref="elementRef" data-testid="target">Target</div>',
    });

    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();

    const targetElement = wrapper.find('[data-testid="target"]').element;
    elementRef.value = targetElement as HTMLDivElement;

    const outsideElement = document.createElement("div");
    document.body.appendChild(outsideElement);

    const event = new MouseEvent("mousedown", { bubbles: true });
    outsideElement.dispatchEvent(event);

    await wrapper.vm.$nextTick();

    expect(handler).not.toHaveBeenCalled();

    document.body.removeChild(outsideElement);
    wrapper.unmount();
  });

  it("does not call handler when enabled ref is false", async () => {
    const elementRef = ref<HTMLDivElement | null>(null);
    const enabledRef = ref(false);
    const TestComponent = defineComponent({
      setup() {
        useOnClickOutside({
          elementRef,
          handler,
          enabled: enabledRef,
        });
        return { elementRef };
      },
      template: '<div ref="elementRef" data-testid="target">Target</div>',
    });

    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();

    const targetElement = wrapper.find('[data-testid="target"]').element;
    elementRef.value = targetElement as HTMLDivElement;

    const outsideElement = document.createElement("div");
    document.body.appendChild(outsideElement);

    const event = new MouseEvent("mousedown", { bubbles: true });
    outsideElement.dispatchEvent(event);

    await wrapper.vm.$nextTick();

    expect(handler).not.toHaveBeenCalled();

    document.body.removeChild(outsideElement);
    wrapper.unmount();
  });

  it("calls handler when enabled ref changes from false to true", async () => {
    const elementRef = ref<HTMLDivElement | null>(null);
    const enabledRef = ref(false);
    const TestComponent = defineComponent({
      setup() {
        useOnClickOutside({
          elementRef,
          handler,
          enabled: enabledRef,
        });
        return { elementRef };
      },
      template: '<div ref="elementRef" data-testid="target">Target</div>',
    });

    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();

    const targetElement = wrapper.find('[data-testid="target"]').element;
    elementRef.value = targetElement as HTMLDivElement;

    const outsideElement = document.createElement("div");
    document.body.appendChild(outsideElement);

    // First click when disabled - should not call handler
    const event1 = new MouseEvent("mousedown", { bubbles: true });
    outsideElement.dispatchEvent(event1);
    await wrapper.vm.$nextTick();
    expect(handler).not.toHaveBeenCalled();

    // Enable and click again - should call handler
    enabledRef.value = true;
    await wrapper.vm.$nextTick();

    const event2 = new MouseEvent("mousedown", { bubbles: true });
    outsideElement.dispatchEvent(event2);
    await wrapper.vm.$nextTick();

    expect(handler).toHaveBeenCalledTimes(1);

    document.body.removeChild(outsideElement);
    wrapper.unmount();
  });

  it("does not call handler when elementRef is null", async () => {
    const elementRef = ref<HTMLDivElement | null>(null);
    const TestComponent = defineComponent({
      setup() {
        useOnClickOutside({
          elementRef,
          handler,
        });
        return { elementRef };
      },
      template: '<div data-testid="target">Target</div>',
    });

    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();

    const outsideElement = document.createElement("div");
    document.body.appendChild(outsideElement);

    const event = new MouseEvent("mousedown", { bubbles: true });
    outsideElement.dispatchEvent(event);

    await wrapper.vm.$nextTick();

    expect(handler).not.toHaveBeenCalled();

    document.body.removeChild(outsideElement);
    wrapper.unmount();
  });

  it("handles touchstart events", async () => {
    const elementRef = ref<HTMLDivElement | null>(null);
    const TestComponent = defineComponent({
      setup() {
        useOnClickOutside({
          elementRef,
          handler,
        });
        return { elementRef };
      },
      template: '<div ref="elementRef" data-testid="target">Target</div>',
    });

    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();

    const targetElement = wrapper.find('[data-testid="target"]').element;
    elementRef.value = targetElement as HTMLDivElement;

    const outsideElement = document.createElement("div");
    document.body.appendChild(outsideElement);

    const event = new TouchEvent("touchstart", { bubbles: true });
    outsideElement.dispatchEvent(event);

    await wrapper.vm.$nextTick();

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(expect.any(TouchEvent));

    document.body.removeChild(outsideElement);
    wrapper.unmount();
  });

  it("removes event listeners on unmount", async () => {
    const elementRef = ref<HTMLDivElement | null>(null);
    const TestComponent = defineComponent({
      setup() {
        useOnClickOutside({
          elementRef,
          handler,
        });
        return { elementRef };
      },
      template: '<div ref="elementRef" data-testid="target">Target</div>',
    });

    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();

    const targetElement = wrapper.find('[data-testid="target"]').element;
    elementRef.value = targetElement as HTMLDivElement;

    const outsideElement = document.createElement("div");
    document.body.appendChild(outsideElement);

    // Click before unmount - should call handler
    const event1 = new MouseEvent("mousedown", { bubbles: true });
    outsideElement.dispatchEvent(event1);
    await wrapper.vm.$nextTick();
    expect(handler).toHaveBeenCalledTimes(1);

    // Unmount component
    wrapper.unmount();
    await wrapper.vm.$nextTick();

    // Click after unmount - should NOT call handler
    handler.mockClear();
    const event2 = new MouseEvent("mousedown", { bubbles: true });
    outsideElement.dispatchEvent(event2);
    await wrapper.vm.$nextTick();

    expect(handler).not.toHaveBeenCalled();

    document.body.removeChild(outsideElement);
  });

  it("defaults enabled to true when not provided", async () => {
    const elementRef = ref<HTMLDivElement | null>(null);
    const TestComponent = defineComponent({
      setup() {
        useOnClickOutside({
          elementRef,
          handler,
        });
        return { elementRef };
      },
      template: '<div ref="elementRef" data-testid="target">Target</div>',
    });

    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();

    const targetElement = wrapper.find('[data-testid="target"]').element;
    elementRef.value = targetElement as HTMLDivElement;

    const outsideElement = document.createElement("div");
    document.body.appendChild(outsideElement);

    const event = new MouseEvent("mousedown", { bubbles: true });
    outsideElement.dispatchEvent(event);

    await wrapper.vm.$nextTick();

    expect(handler).toHaveBeenCalledTimes(1);

    document.body.removeChild(outsideElement);
    wrapper.unmount();
  });
});


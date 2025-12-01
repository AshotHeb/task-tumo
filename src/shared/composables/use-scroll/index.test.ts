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
import { useScroll } from "./index";

describe("useScroll", () => {
  let handler: ReturnType<typeof jest.fn>;
  let mockRequestAnimationFrame: ReturnType<typeof jest.spyOn>;
  let mockCancelAnimationFrame: ReturnType<typeof jest.spyOn>;
  let rafCallbacks: Array<FrameRequestCallback>;
  let rafIdCounter: number;

  beforeEach(() => {
    handler = jest.fn();
    rafCallbacks = [];
    rafIdCounter = 0;

    // Mock requestAnimationFrame
    mockRequestAnimationFrame = jest.spyOn(window, "requestAnimationFrame");
    mockRequestAnimationFrame.mockImplementation((callback: FrameRequestCallback) => {
      rafCallbacks.push(callback);
      return ++rafIdCounter;
    });

    // Mock cancelAnimationFrame
    mockCancelAnimationFrame = jest.spyOn(window, "cancelAnimationFrame");
    mockCancelAnimationFrame.mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    rafCallbacks = [];
    rafIdCounter = 0;
  });

  const flushRaf = (): void => {
    const callbacks = [...rafCallbacks];
    rafCallbacks = [];
    callbacks.forEach((callback) => callback(performance.now()));
  };

  it("attaches scroll and wheel listeners when mounted", async () => {
    const elementRef = ref<HTMLDivElement | null>(null);

    const TestComponent = defineComponent({
      setup() {
        useScroll({
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
    await wrapper.vm.$nextTick();

    // Trigger scroll event
    const scrollEvent = new Event("scroll", { bubbles: true });
    targetElement.dispatchEvent(scrollEvent);
    flushRaf();

    expect(handler).toHaveBeenCalledTimes(1);

    wrapper.unmount();
  });

  it("calls handler on scroll event", async () => {
    const elementRef = ref<HTMLDivElement | null>(null);

    const TestComponent = defineComponent({
      setup() {
        useScroll({
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
    await wrapper.vm.$nextTick();

    const scrollEvent = new Event("scroll", { bubbles: true });
    targetElement.dispatchEvent(scrollEvent);
    flushRaf();

    expect(handler).toHaveBeenCalledTimes(1);

    wrapper.unmount();
  });

  it("calls handler on wheel event", async () => {
    const elementRef = ref<HTMLDivElement | null>(null);

    const TestComponent = defineComponent({
      setup() {
        useScroll({
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
    await wrapper.vm.$nextTick();

    const wheelEvent = new WheelEvent("wheel", { bubbles: true });
    targetElement.dispatchEvent(wheelEvent);
    flushRaf();

    expect(handler).toHaveBeenCalledTimes(1);

    wrapper.unmount();
  });

  it("throttles multiple events using requestAnimationFrame", async () => {
    const elementRef = ref<HTMLDivElement | null>(null);

    const TestComponent = defineComponent({
      setup() {
        useScroll({
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
    await wrapper.vm.$nextTick();

    // Trigger multiple scroll events rapidly
    const scrollEvent1 = new Event("scroll", { bubbles: true });
    const scrollEvent2 = new Event("scroll", { bubbles: true });
    const scrollEvent3 = new Event("scroll", { bubbles: true });

    targetElement.dispatchEvent(scrollEvent1);
    targetElement.dispatchEvent(scrollEvent2);
    targetElement.dispatchEvent(scrollEvent3);

    // Handler should not be called yet
    expect(handler).not.toHaveBeenCalled();

    // Flush RAF - should only call handler once
    flushRaf();

    expect(handler).toHaveBeenCalledTimes(1);

    wrapper.unmount();
  });

  it("does not call handler when enabled is false", async () => {
    const elementRef = ref<HTMLDivElement | null>(null);

    const TestComponent = defineComponent({
      setup() {
        useScroll({
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
    await wrapper.vm.$nextTick();

    const scrollEvent = new Event("scroll", { bubbles: true });
    targetElement.dispatchEvent(scrollEvent);
    flushRaf();

    expect(handler).not.toHaveBeenCalled();

    wrapper.unmount();
  });

  it("handles enabled as ref", async () => {
    const elementRef = ref<HTMLDivElement | null>(null);
    const enabled = ref(true);

    const TestComponent = defineComponent({
      setup() {
        useScroll({
          elementRef,
          handler,
          enabled,
        });
        return { elementRef, enabled };
      },
      template: '<div ref="elementRef" data-testid="target">Target</div>',
    });

    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();

    const targetElement = wrapper.find('[data-testid="target"]').element;
    elementRef.value = targetElement as HTMLDivElement;
    await wrapper.vm.$nextTick();

    // Initially enabled - should work
    const scrollEvent1 = new Event("scroll", { bubbles: true });
    targetElement.dispatchEvent(scrollEvent1);
    flushRaf();

    expect(handler).toHaveBeenCalledTimes(1);

    // Disable
    enabled.value = false;
    await wrapper.vm.$nextTick();

    // Should not call handler when disabled
    const scrollEvent2 = new Event("scroll", { bubbles: true });
    targetElement.dispatchEvent(scrollEvent2);
    flushRaf();

    expect(handler).toHaveBeenCalledTimes(1); // Still 1, not 2

    wrapper.unmount();
  });

  it("updates listeners when elementRef changes", async () => {
    const elementRef = ref<HTMLDivElement | null>(null);

    const TestComponent = defineComponent({
      setup() {
        useScroll({
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
    await wrapper.vm.$nextTick();

    // Trigger event on first element
    const scrollEvent1 = new Event("scroll", { bubbles: true });
    targetElement.dispatchEvent(scrollEvent1);
    flushRaf();

    expect(handler).toHaveBeenCalledTimes(1);

    // Change element
    const newElement = document.createElement("div");
    elementRef.value = newElement as HTMLDivElement;
    await wrapper.vm.$nextTick();

    // Trigger event on new element
    const scrollEvent2 = new Event("scroll", { bubbles: true });
    newElement.dispatchEvent(scrollEvent2);
    flushRaf();

    expect(handler).toHaveBeenCalledTimes(2);

    wrapper.unmount();
  });

  it("removes listeners on unmount", async () => {
    const elementRef = ref<HTMLDivElement | null>(null);
    const removeEventListenerSpy = jest.spyOn(
      HTMLElement.prototype,
      "removeEventListener"
    );

    const TestComponent = defineComponent({
      setup() {
        useScroll({
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
    await wrapper.vm.$nextTick();

    // Reset handler mock
    handler.mockClear();

    wrapper.unmount();

    // After unmount, removeEventListener should have been called
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "wheel",
      expect.any(Function)
    );

    removeEventListenerSpy.mockRestore();
  });

  it("cancels pending animation frame on unmount", async () => {
    const elementRef = ref<HTMLDivElement | null>(null);
    let rafId: number | null = null;

    // Track RAF IDs
    mockRequestAnimationFrame.mockImplementation((callback: FrameRequestCallback) => {
      rafId = ++rafIdCounter;
      rafCallbacks.push(callback);
      return rafId;
    });

    const TestComponent = defineComponent({
      setup() {
        useScroll({
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
    await wrapper.vm.$nextTick();

    // Reset handler mock
    handler.mockClear();

    // Trigger event but don't flush RAF
    const scrollEvent = new Event("scroll", { bubbles: true });
    targetElement.dispatchEvent(scrollEvent);

    // Verify RAF was requested
    expect(mockRequestAnimationFrame).toHaveBeenCalled();
    expect(rafId).not.toBeNull();

    // Unmount should cancel pending RAF
    wrapper.unmount();

    // Verify cancelAnimationFrame was called with the correct ID
    expect(mockCancelAnimationFrame).toHaveBeenCalledWith(rafId);

    // Clear the RAF callbacks since it was cancelled
    rafCallbacks = [];
  });

  it("handles null elementRef gracefully", async () => {
    const elementRef = ref<HTMLDivElement | null>(null);

    const TestComponent = defineComponent({
      setup() {
        useScroll({
          elementRef,
          handler,
        });
        return { elementRef };
      },
      template: "<div>Test</div>",
    });

    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();

    // elementRef is null, should not throw
    expect(() => wrapper.unmount()).not.toThrow();
  });

  it("uses passive event listeners", async () => {
    const elementRef = ref<HTMLDivElement | null>(null);
    const addEventListenerSpy = jest.spyOn(HTMLElement.prototype, "addEventListener");

    const TestComponent = defineComponent({
      setup() {
        useScroll({
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
    await wrapper.vm.$nextTick();

    // Check that addEventListener was called with passive: true
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
      { passive: true }
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "wheel",
      expect.any(Function),
      { passive: true }
    );

    addEventListenerSpy.mockRestore();
    wrapper.unmount();
  });
});

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
import { useInfiniteScroll } from "./index";

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
  constructor(
    public callback: IntersectionObserverCallback,
    public options?: IntersectionObserverInit
  ) {}
}

describe("useInfiniteScroll", () => {
  let handler: ReturnType<typeof jest.fn>;
  let mockObserver: MockIntersectionObserver;

  beforeEach(() => {
    handler = jest.fn();
    mockObserver = new MockIntersectionObserver(() => {});

    // Mock IntersectionObserver globally
    global.IntersectionObserver = jest.fn(
      (
        callback: IntersectionObserverCallback,
        options?: IntersectionObserverInit
      ) => {
        mockObserver = new MockIntersectionObserver(callback, options);
        return mockObserver as unknown as IntersectionObserver;
      }
    ) as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("creates observer and observes element when mounted", async () => {
    const elementRef = ref<HTMLDivElement | null>(null);

    const TestComponent = defineComponent({
      setup() {
        useInfiniteScroll({
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

    expect(global.IntersectionObserver).toHaveBeenCalled();
    expect(mockObserver.observe).toHaveBeenCalledWith(targetElement);

    wrapper.unmount();
  });

  it("calls handler when element intersects", async () => {
    const elementRef = ref<HTMLDivElement | null>(null);

    const TestComponent = defineComponent({
      setup() {
        useInfiniteScroll({
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

    // Simulate intersection
    const entry = {
      isIntersecting: true,
      target: targetElement,
    } as IntersectionObserverEntry;

    mockObserver.callback(
      [entry],
      mockObserver as unknown as IntersectionObserver
    );

    expect(handler).toHaveBeenCalledTimes(1);

    wrapper.unmount();
  });

  it("does not call handler when element is not intersecting", async () => {
    const elementRef = ref<HTMLDivElement | null>(null);

    const TestComponent = defineComponent({
      setup() {
        useInfiniteScroll({
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

    // Simulate non-intersection
    const entry = {
      isIntersecting: false,
      target: targetElement,
    } as IntersectionObserverEntry;

    mockObserver.callback(
      [entry],
      mockObserver as unknown as IntersectionObserver
    );

    expect(handler).not.toHaveBeenCalled();

    wrapper.unmount();
  });

  it("uses custom threshold", async () => {
    const elementRef = ref<HTMLDivElement | null>(null);

    const TestComponent = defineComponent({
      setup() {
        useInfiniteScroll({
          elementRef,
          handler,
          threshold: 0.5,
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

    expect(global.IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        threshold: 0.5,
        rootMargin: "0px",
      })
    );

    wrapper.unmount();
  });

  it("does not observe when enabled is false", async () => {
    const elementRef = ref<HTMLDivElement | null>(null);

    const TestComponent = defineComponent({
      setup() {
        useInfiniteScroll({
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

    // Observer should not be created when disabled
    expect(mockObserver.observe).not.toHaveBeenCalled();

    wrapper.unmount();
  });

  it("handles enabled as ref", async () => {
    const elementRef = ref<HTMLDivElement | null>(null);
    const enabled = ref(true);

    const TestComponent = defineComponent({
      setup() {
        useInfiniteScroll({
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

    expect(mockObserver.observe).toHaveBeenCalled();

    // Disable
    enabled.value = false;
    await wrapper.vm.$nextTick();

    expect(mockObserver.disconnect).toHaveBeenCalled();

    wrapper.unmount();
  });

  it("updates observer when elementRef changes", async () => {
    const elementRef = ref<HTMLDivElement | null>(null);

    const TestComponent = defineComponent({
      setup() {
        useInfiniteScroll({
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

    expect(mockObserver.observe).toHaveBeenCalledWith(targetElement);

    // Change element
    const newElement = document.createElement("div");
    elementRef.value = newElement as HTMLDivElement;
    await wrapper.vm.$nextTick();

    expect(mockObserver.unobserve).toHaveBeenCalledWith(targetElement);
    expect(mockObserver.observe).toHaveBeenCalledWith(newElement);

    wrapper.unmount();
  });

  it("disconnects observer on unmount", async () => {
    const elementRef = ref<HTMLDivElement | null>(null);

    const TestComponent = defineComponent({
      setup() {
        useInfiniteScroll({
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

    wrapper.unmount();

    expect(mockObserver.disconnect).toHaveBeenCalled();
  });

  it("handles missing IntersectionObserver gracefully", async () => {
    const originalIntersectionObserver = global.IntersectionObserver;
    // @ts-expect-error - Intentionally removing IntersectionObserver
    delete global.IntersectionObserver;

    const elementRef = ref<HTMLDivElement | null>(null);

    const TestComponent = defineComponent({
      setup() {
        useInfiniteScroll({
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

    // Should not throw error
    expect(() => wrapper.unmount()).not.toThrow();

    // Restore
    global.IntersectionObserver = originalIntersectionObserver;
  });

  it("handles missing window gracefully", () => {
    // Test that the composable checks for window existence
    const originalIntersectionObserver = global.IntersectionObserver;

    // Temporarily remove IntersectionObserver to simulate SSR
    // @ts-expect-error - Intentionally removing IntersectionObserver
    delete global.IntersectionObserver;

    const elementRef = ref<HTMLDivElement | null>(null);

    const TestComponent = defineComponent({
      setup() {
        useInfiniteScroll({
          elementRef,
          handler,
        });
        return { elementRef };
      },
      template: '<div ref="elementRef" data-testid="target">Target</div>',
    });

    // Should not throw error when IntersectionObserver is missing
    expect(() => {
      const wrapper = mount(TestComponent);
      wrapper.unmount();
    }).not.toThrow();

    // Restore
    global.IntersectionObserver = originalIntersectionObserver;
  });
});

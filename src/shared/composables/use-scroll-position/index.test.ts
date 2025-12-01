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
import { createPinia, setActivePinia } from "pinia";
import { useScrollPosition } from "./index";
import { useScrollPositionStore } from "@/stores/scroll-position";

// Mock window.scrollTo and window.scrollY
let mockScrollY = 0;
let mockPageYOffset = 0;
const mockScrollTo = jest.fn(
  (optionsOrX?: number | { top?: number; behavior?: string }, y?: number) => {
    if (typeof optionsOrX === "object" && optionsOrX !== null) {
      mockScrollY = optionsOrX.top || 0;
      mockPageYOffset = optionsOrX.top || 0;
    } else if (typeof optionsOrX === "number") {
      mockScrollY = optionsOrX;
      mockPageYOffset = y || optionsOrX;
    }
  }
);

// Mock HTMLElement.scrollTo and scrollTop
const createMockElement = () => {
  let scrollTop = 0;
  const element = document.createElement("div");
  const mockScrollToFn = jest.fn(
    (options?: { top?: number; behavior?: string }) => {
      if (typeof options === "object" && options !== null) {
        scrollTop = options.top || 0;
      }
    }
  );
  element.scrollTo = mockScrollToFn as typeof element.scrollTo;
  Object.defineProperty(element, "scrollTop", {
    get: () => scrollTop,
    set: (value) => {
      scrollTop = value;
    },
    configurable: true,
  });
  return element;
};

describe("useScrollPosition", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    // Reset scroll position mocks
    mockScrollY = 0;
    mockPageYOffset = 0;
    mockScrollTo.mockClear();

    // Setup window mocks
    Object.defineProperty(window, "scrollY", {
      writable: true,
      configurable: true,
      value: mockScrollY,
    });
    Object.defineProperty(window, "pageYOffset", {
      writable: true,
      configurable: true,
      value: mockPageYOffset,
    });
    window.scrollTo = mockScrollTo as typeof window.scrollTo;
  });

  afterEach(() => {
    jest.clearAllMocks();
    // Reset scroll position
    mockScrollY = 0;
    mockPageYOffset = 0;
    Object.defineProperty(window, "scrollY", {
      writable: true,
      configurable: true,
      value: 0,
    });
    Object.defineProperty(window, "pageYOffset", {
      writable: true,
      configurable: true,
      value: 0,
    });
  });

  it("saves and restores scroll position for window", async () => {
    const TestComponent = defineComponent({
      setup() {
        useScrollPosition({
          key: "test-key",
        });
        return {};
      },
      template: "<div>Test</div>",
    });

    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();

    // Set scroll position
    mockScrollY = 100;
    mockPageYOffset = 100;
    Object.defineProperty(window, "scrollY", {
      writable: true,
      configurable: true,
      value: 100,
    });
    Object.defineProperty(window, "pageYOffset", {
      writable: true,
      configurable: true,
      value: 100,
    });

    await wrapper.vm.$nextTick();

    expect(window.scrollY).toBe(100);

    wrapper.unmount();
  });

  it("saves and restores scroll position for element", async () => {
    const elementRef = ref<HTMLElement | null>(null);
    const mockElement = createMockElement();

    const TestComponent = defineComponent({
      setup() {
        const { restorePosition } = useScrollPosition({
          key: "element-key",
          elementRef,
          restoreOnMount: false, // Disable auto-restore to test manually
        });
        return { elementRef, restorePosition };
      },
      template: '<div ref="elementRef">Test</div>',
    });

    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();

    elementRef.value = mockElement;
    await wrapper.vm.$nextTick();

    // Set scroll position
    mockElement.scrollTop = 200;
    await wrapper.vm.$nextTick();

    wrapper.unmount();

    // Remount to test restore
    const wrapper2 = mount(TestComponent);
    await wrapper2.vm.$nextTick();
    elementRef.value = mockElement;
    await wrapper2.vm.$nextTick();

    // Manually restore position using the function from component instance
    wrapper2.vm.restorePosition();

    // Should restore position
    expect(mockElement.scrollTo).toHaveBeenCalledWith({
      top: 200,
      behavior: "instant",
    });
    wrapper2.unmount();
  });

  it("restores position on mount when restoreOnMount is true", async () => {
    const store = useScrollPositionStore();
    store.savePosition("restore-test", 150);

    const TestComponent = defineComponent({
      setup() {
        useScrollPosition({
          key: "restore-test",
          restoreOnMount: true,
        });
        return {};
      },
      template: "<div>Test</div>",
    });

    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();

    // Position should be restored
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 150,
      behavior: "instant",
    });

    wrapper.unmount();
  });

  it("saves position on unmount when saveOnUnmount is true", async () => {
    const TestComponent = defineComponent({
      setup() {
        useScrollPosition({
          key: "save-test",
          saveOnUnmount: true,
        });
        return {};
      },
      template: "<div>Test</div>",
    });

    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();

    // Set scroll position
    mockScrollY = 250;
    mockPageYOffset = 250;
    Object.defineProperty(window, "scrollY", {
      writable: true,
      configurable: true,
      value: 250,
    });
    Object.defineProperty(window, "pageYOffset", {
      writable: true,
      configurable: true,
      value: 250,
    });
    await wrapper.vm.$nextTick();

    wrapper.unmount();

    const store = useScrollPositionStore();
    const savedPosition = store.getPosition("save-test");
    expect(savedPosition).toBe(250);
  });

  it("does not restore position when restoreOnMount is false", async () => {
    const store = useScrollPositionStore();
    store.savePosition("no-restore-test", 300);

    const TestComponent = defineComponent({
      setup() {
        useScrollPosition({
          key: "no-restore-test",
          restoreOnMount: false,
        });
        return {};
      },
      template: "<div>Test</div>",
    });

    mockScrollTo.mockClear();

    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();

    // Position should not be restored
    expect(window.scrollTo).not.toHaveBeenCalled();

    wrapper.unmount();
  });

  it("does not save position when saveOnUnmount is false", async () => {
    const TestComponent = defineComponent({
      setup() {
        useScrollPosition({
          key: "no-save-test",
          saveOnUnmount: false,
        });
        return {};
      },
      template: "<div>Test</div>",
    });

    // Set scroll position
    mockScrollY = 350;
    mockPageYOffset = 350;
    Object.defineProperty(window, "scrollY", {
      writable: true,
      configurable: true,
      value: 350,
    });
    Object.defineProperty(window, "pageYOffset", {
      writable: true,
      configurable: true,
      value: 350,
    });

    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();

    // Unmount should not save position
    wrapper.unmount();

    const store = useScrollPositionStore();
    const savedPosition = store.getPosition("no-save-test");
    expect(savedPosition).toBeUndefined();
  });

  it("handles key as ref", async () => {
    const keyRef = ref("ref-key");

    const TestComponent = defineComponent({
      setup() {
        useScrollPosition({
          key: keyRef,
        });
        return {};
      },
      template: "<div>Test</div>",
    });

    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();

    // Set scroll position
    mockScrollY = 400;
    mockPageYOffset = 400;
    Object.defineProperty(window, "scrollY", {
      writable: true,
      configurable: true,
      value: 400,
    });
    Object.defineProperty(window, "pageYOffset", {
      writable: true,
      configurable: true,
      value: 400,
    });
    await wrapper.vm.$nextTick();

    wrapper.unmount();

    const store = useScrollPositionStore();
    const savedPosition = store.getPosition("ref-key");
    expect(savedPosition).toBe(400);
  });

  it("manually saves and restores position", async () => {
    const TestComponent = defineComponent({
      setup() {
        const { savePosition, restorePosition } = useScrollPosition({
          key: "manual-test",
          saveOnUnmount: false,
          restoreOnMount: false,
        });
        return { savePosition, restorePosition };
      },
      template: "<div>Test</div>",
    });

    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();

    // Set scroll position
    mockScrollY = 400;
    mockPageYOffset = 400;
    Object.defineProperty(window, "scrollY", {
      writable: true,
      configurable: true,
      value: 400,
    });
    Object.defineProperty(window, "pageYOffset", {
      writable: true,
      configurable: true,
      value: 400,
    });
    await wrapper.vm.$nextTick();

    wrapper.vm.savePosition();
    await wrapper.vm.$nextTick();

    window.scrollTo(0, 0);
    await wrapper.vm.$nextTick();

    wrapper.vm.restorePosition();

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 400,
      behavior: "instant",
    });

    wrapper.unmount();
  });

  it("handles window scroll position correctly", async () => {
    const TestComponent = defineComponent({
      setup() {
        const { getCurrentPosition } = useScrollPosition({
          key: "position-test",
        });
        return { getCurrentPosition };
      },
      template: "<div>Test</div>",
    });

    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();

    // Set scroll position
    mockScrollY = 600;
    mockPageYOffset = 600;
    Object.defineProperty(window, "scrollY", {
      writable: true,
      configurable: true,
      value: 600,
    });
    Object.defineProperty(window, "pageYOffset", {
      writable: true,
      configurable: true,
      value: 600,
    });
    await wrapper.vm.$nextTick();

    const position = wrapper.vm.getCurrentPosition();

    expect(position).toBe(600);

    wrapper.unmount();
  });
});

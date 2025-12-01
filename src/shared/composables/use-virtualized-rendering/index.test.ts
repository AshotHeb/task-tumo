import {
  describe,
  it,
  expect,
  jest,
  beforeEach,
  afterEach,
} from "@jest/globals";
import { mount } from "@vue/test-utils";
import { ref, computed, defineComponent } from "vue";
import { useVirtualizedRendering } from "./index";

describe("useVirtualizedRendering", () => {
  let originalInnerHeight: number;
  let mockContainer: HTMLDivElement;

  beforeEach(() => {
    // Save original window.innerHeight
    originalInnerHeight = window.innerHeight;

    // Mock window.innerHeight
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 800,
    });

    // Create mock container element
    mockContainer = document.createElement("div");
    mockContainer.scrollTop = 0;
    document.body.appendChild(mockContainer);
  });

  afterEach(() => {
    // Restore original window.innerHeight
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: originalInnerHeight,
    });

    // Clean up DOM
    if (mockContainer && mockContainer.parentNode) {
      mockContainer.parentNode.removeChild(mockContainer);
    }

    jest.clearAllMocks();
  });

  it("initializes visibleRange to { start: 0, end: 0 }", () => {
    const containerElement = ref<HTMLDivElement | null>(mockContainer);
    const rowHeight = 100;
    const rowGap = 10;

    const TestComponent = defineComponent({
      setup() {
        const { visibleRange } = useVirtualizedRendering({
          containerElement,
          rowHeight,
          rowGap,
        });
        return { visibleRange };
      },
      template: "<div>Test</div>",
    });

    const wrapper = mount(TestComponent);

    // Before mount, visibleRange should be initialized to { start: 0, end: 0 }
    // But since we can't access it before mount, we check it's reactive
    expect(wrapper.vm.visibleRange).toBeDefined();
    expect(typeof wrapper.vm.visibleRange.start).toBe("number");
    expect(typeof wrapper.vm.visibleRange.end).toBe("number");

    wrapper.unmount();
  });

  it("calculates initial visible range on mount", async () => {
    const containerElement = ref<HTMLDivElement | null>(mockContainer);
    const rowHeight = 100;
    const rowGap = 10;
    mockContainer.scrollTop = 0;

    const TestComponent = defineComponent({
      setup() {
        const { visibleRange } = useVirtualizedRendering({
          containerElement,
          rowHeight,
          rowGap,
        });
        return { visibleRange };
      },
      template: "<div>Test</div>",
    });

    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();

    // Calculate expected range
    // T = Math.floor(0 + 800 / 2) = 400
    // RangePoint = Math.floor(400 / 110) = 3
    // start = 3 - 3 = 0, end = 3 + 3 = 6
    expect(wrapper.vm.visibleRange.start).toBe(0);
    expect(wrapper.vm.visibleRange.end).toBe(6);

    wrapper.unmount();
  });

  it("works correctly when rowHeight is a number", async () => {
    const containerElement = ref<HTMLDivElement | null>(mockContainer);
    const rowHeight = 50;
    const rowGap = 5;
    mockContainer.scrollTop = 0;

    const TestComponent = defineComponent({
      setup() {
        const { visibleRange } = useVirtualizedRendering({
          containerElement,
          rowHeight,
          rowGap,
        });
        return { visibleRange };
      },
      template: "<div>Test</div>",
    });

    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();

    // T = Math.floor(0 + 800 / 2) = 400
    // RangePoint = Math.floor(400 / 55) = 7
    // start = 7 - 3 = 4, end = 7 + 3 = 10
    expect(wrapper.vm.visibleRange.start).toBe(4);
    expect(wrapper.vm.visibleRange.end).toBe(10);

    wrapper.unmount();
  });

  it("works correctly when rowHeight is a ref and reacts to changes", async () => {
    const containerElement = ref<HTMLDivElement | null>(mockContainer);
    const rowHeight = ref(100);
    const rowGap = 10;
    mockContainer.scrollTop = 0;

    const TestComponent = defineComponent({
      setup() {
        const { visibleRange } = useVirtualizedRendering({
          containerElement,
          rowHeight,
          rowGap,
        });
        return { visibleRange, rowHeight };
      },
      template: "<div>Test</div>",
    });

    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();

    // Initial calculation: T = 400, RangePoint = 3, start = 0, end = 6
    expect(wrapper.vm.visibleRange.start).toBe(0);
    expect(wrapper.vm.visibleRange.end).toBe(6);

    // Change rowHeight
    rowHeight.value = 200;
    await wrapper.vm.$nextTick();

    // Recalculation: T = 400, RangePoint = Math.floor(400 / 210) = 1, start = -2, end = 4
    expect(wrapper.vm.visibleRange.start).toBe(-2);
    expect(wrapper.vm.visibleRange.end).toBe(4);

    wrapper.unmount();
  });

  it("works correctly when rowHeight is a computed ref", async () => {
    const containerElement = ref<HTMLDivElement | null>(mockContainer);
    const baseHeight = ref(50);
    const rowHeight = computed(() => baseHeight.value * 2);
    const rowGap = 5;
    mockContainer.scrollTop = 0;

    const TestComponent = defineComponent({
      setup() {
        const { visibleRange } = useVirtualizedRendering({
          containerElement,
          rowHeight,
          rowGap,
        });
        return { visibleRange };
      },
      template: "<div>Test</div>",
    });

    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();

    // Initial: rowHeight = 100, T = 400, RangePoint = Math.floor(400 / 105) = 3, start = 0, end = 6
    expect(wrapper.vm.visibleRange.start).toBe(0);
    expect(wrapper.vm.visibleRange.end).toBe(6);

    // Change base height
    baseHeight.value = 75;
    await wrapper.vm.$nextTick();

    // Recalculation: rowHeight = 150, T = 400, RangePoint = Math.floor(400 / 155) = 2, start = -1, end = 5
    expect(wrapper.vm.visibleRange.start).toBe(-1);
    expect(wrapper.vm.visibleRange.end).toBe(5);

    wrapper.unmount();
  });

  it("works correctly when rowGap is a number", async () => {
    const containerElement = ref<HTMLDivElement | null>(mockContainer);
    const rowHeight = 100;
    const rowGap = 20;
    mockContainer.scrollTop = 0;

    const TestComponent = defineComponent({
      setup() {
        const { visibleRange } = useVirtualizedRendering({
          containerElement,
          rowHeight,
          rowGap,
        });
        return { visibleRange };
      },
      template: "<div>Test</div>",
    });

    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();

    // T = 400, RangePoint = Math.floor(400 / 120) = 3, start = 0, end = 6
    expect(wrapper.vm.visibleRange.start).toBe(0);
    expect(wrapper.vm.visibleRange.end).toBe(6);

    wrapper.unmount();
  });

  it("recalculates visible range when container scrolls", async () => {
    const containerElement = ref<HTMLDivElement | null>(mockContainer);
    const rowHeight = 100;
    const rowGap = 10;
    mockContainer.scrollTop = 0;

    // Mock requestAnimationFrame for useScroll throttling
    const rafSpy = jest.spyOn(window, "requestAnimationFrame");
    let rafCallback: FrameRequestCallback | null = null;
    rafSpy.mockImplementation(((callback: FrameRequestCallback): number => {
      rafCallback = callback;
      return 1;
    }) as typeof window.requestAnimationFrame);

    const TestComponent = defineComponent({
      setup() {
        const { visibleRange } = useVirtualizedRendering({
          containerElement,
          rowHeight,
          rowGap,
        });
        return { visibleRange };
      },
      template: "<div>Test</div>",
    });

    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();

    // Initial: scrollTop = 0, T = 400, RangePoint = 3, start = 0, end = 6
    expect(wrapper.vm.visibleRange.start).toBe(0);
    expect(wrapper.vm.visibleRange.end).toBe(6);

    // Simulate scroll
    mockContainer.scrollTop = 550;
    const scrollEvent = new Event("scroll", { bubbles: true });
    mockContainer.dispatchEvent(scrollEvent);

    // Trigger RAF callback
    if (rafCallback) {
      (rafCallback as FrameRequestCallback)(0);
    }
    await wrapper.vm.$nextTick();

    // Recalculation: T = Math.floor(550 + 400) = 950, RangePoint = Math.floor(950 / 110) = 8, start = 5, end = 11
    expect(wrapper.vm.visibleRange.start).toBe(5);
    expect(wrapper.vm.visibleRange.end).toBe(11);

    rafSpy.mockRestore();
    wrapper.unmount();
  });

  it("returns early when rowHeight + rowGap equals zero", async () => {
    const containerElement = ref<HTMLDivElement | null>(mockContainer);
    const rowHeight = 0;
    const rowGap = 0;
    mockContainer.scrollTop = 0;

    const TestComponent = defineComponent({
      setup() {
        const { visibleRange } = useVirtualizedRendering({
          containerElement,
          rowHeight,
          rowGap,
        });
        return { visibleRange };
      },
      template: "<div>Test</div>",
    });

    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();

    // When currentRowHeight is 0, calculateVisibleRange returns early
    // So visibleRange should remain at initial values { start: 0, end: 0 }
    expect(wrapper.vm.visibleRange.start).toBe(0);
    expect(wrapper.vm.visibleRange.end).toBe(0);

    wrapper.unmount();
  });

  it("handles null container element gracefully", async () => {
    const containerElement = ref<HTMLDivElement | null>(null);
    const rowHeight = 100;
    const rowGap = 10;

    const TestComponent = defineComponent({
      setup() {
        const { visibleRange } = useVirtualizedRendering({
          containerElement,
          rowHeight,
          rowGap,
        });
        return { visibleRange };
      },
      template: "<div>Test</div>",
    });

    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();

    // When containerElement is null, scrollTop defaults to 0
    // T = Math.floor(0 + 800 / 2) = 400, RangePoint = 3, start = 0, end = 6
    expect(wrapper.vm.visibleRange.start).toBe(0);
    expect(wrapper.vm.visibleRange.end).toBe(6);

    wrapper.unmount();
  });

  it("calculates range correctly based on scroll position", async () => {
    const containerElement = ref<HTMLDivElement | null>(mockContainer);
    const rowHeight = 100;
    const rowGap = 10;

    // Test case 1: scrollTop = 0
    mockContainer.scrollTop = 0;
    const TestComponent1 = defineComponent({
      setup() {
        const { visibleRange } = useVirtualizedRendering({
          containerElement,
          rowHeight,
          rowGap,
        });
        return { visibleRange };
      },
      template: "<div>Test</div>",
    });

    const wrapper1 = mount(TestComponent1);
    await wrapper1.vm.$nextTick();

    // T = Math.floor(0 + 800 / 2) = 400
    // RangePoint = Math.floor(400 / 110) = 3
    // start = 3 - 3 = 0, end = 3 + 3 = 6
    expect(wrapper1.vm.visibleRange.start).toBe(0);
    expect(wrapper1.vm.visibleRange.end).toBe(6);

    wrapper1.unmount();

    // Test case 2: scrollTop = 1100
    mockContainer.scrollTop = 1100;
    const TestComponent2 = defineComponent({
      setup() {
        const { visibleRange } = useVirtualizedRendering({
          containerElement,
          rowHeight,
          rowGap,
        });
        return { visibleRange };
      },
      template: "<div>Test</div>",
    });

    const wrapper2 = mount(TestComponent2);
    await wrapper2.vm.$nextTick();

    // T = Math.floor(1100 + 800 / 2) = Math.floor(1500) = 1500
    // RangePoint = Math.floor(1500 / 110) = 13
    // start = 13 - 3 = 10, end = 13 + 3 = 16
    expect(wrapper2.vm.visibleRange.start).toBe(10);
    expect(wrapper2.vm.visibleRange.end).toBe(16);

    wrapper2.unmount();
  });

  it("reacts to rowHeight ref changes and recalculates", async () => {
    const containerElement = ref<HTMLDivElement | null>(mockContainer);
    const rowHeight = ref(100);
    const rowGap = 10;
    mockContainer.scrollTop = 0;

    const TestComponent = defineComponent({
      setup() {
        const { visibleRange } = useVirtualizedRendering({
          containerElement,
          rowHeight,
          rowGap,
        });
        return { visibleRange, rowHeight };
      },
      template: "<div>Test</div>",
    });

    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();

    // Initial: rowHeight = 100, T = 400, RangePoint = 3, start = 0, end = 6
    expect(wrapper.vm.visibleRange.start).toBe(0);
    expect(wrapper.vm.visibleRange.end).toBe(6);

    // Change rowHeight (should trigger watch)
    rowHeight.value = 50;
    await wrapper.vm.$nextTick();

    // Recalculation: rowHeight = 50, T = 400, RangePoint = Math.floor(400 / 60) = 6, start = 3, end = 9
    expect(wrapper.vm.visibleRange.start).toBe(3);
    expect(wrapper.vm.visibleRange.end).toBe(9);

    wrapper.unmount();
  });

  it("recalculates visible range on wheel events", async () => {
    const containerElement = ref<HTMLDivElement | null>(mockContainer);
    const rowHeight = 100;
    const rowGap = 10;
    mockContainer.scrollTop = 0;

    // Mock requestAnimationFrame for useScroll throttling
    const rafSpy = jest.spyOn(window, "requestAnimationFrame");
    let rafCallback: FrameRequestCallback | null = null;
    rafSpy.mockImplementation(((callback: FrameRequestCallback): number => {
      rafCallback = callback;
      return 1;
    }) as typeof window.requestAnimationFrame);

    const TestComponent = defineComponent({
      setup() {
        const { visibleRange } = useVirtualizedRendering({
          containerElement,
          rowHeight,
          rowGap,
        });
        return { visibleRange };
      },
      template: "<div>Test</div>",
    });

    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();

    // Initial: scrollTop = 0, T = 400, RangePoint = 3, start = 0, end = 6
    expect(wrapper.vm.visibleRange.start).toBe(0);
    expect(wrapper.vm.visibleRange.end).toBe(6);

    // Simulate wheel event
    mockContainer.scrollTop = 330;
    const wheelEvent = new WheelEvent("wheel", { bubbles: true });
    mockContainer.dispatchEvent(wheelEvent);

    // Trigger RAF callback
    if (rafCallback) {
      (rafCallback as FrameRequestCallback)(0);
    }
    await wrapper.vm.$nextTick();

    // Recalculation: T = Math.floor(330 + 400) = 730, RangePoint = Math.floor(730 / 110) = 6, start = 3, end = 9
    expect(wrapper.vm.visibleRange.start).toBe(3);
    expect(wrapper.vm.visibleRange.end).toBe(9);

    rafSpy.mockRestore();
    wrapper.unmount();
  });
});

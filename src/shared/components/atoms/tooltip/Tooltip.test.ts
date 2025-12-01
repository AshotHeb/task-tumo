import {
  describe,
  it,
  expect,
  jest,
  beforeEach,
  afterEach,
} from "@jest/globals";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import Tooltip from "./Tooltip.vue";
import type { TooltipProps } from "./types";

describe("Tooltip", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("renders tooltip wrapper", () => {
    const wrapper = mount(Tooltip, {
      props: {},
      slots: {
        default: "<button>Hover me</button>",
      },
    });

    const wrapperElement = wrapper.find(".tooltip-wrapper");
    expect(wrapperElement.exists()).toBe(true);
  });

  it("renders slot content", () => {
    const wrapper = mount(Tooltip, {
      props: {},
      slots: {
        default: "<button>Hover me</button>",
      },
    });

    expect(wrapper.html()).toContain("Hover me");
  });

  it("shows tooltip on mouseenter without delay", async () => {
    const props: TooltipProps = {
      content: "Tooltip content",
      delay: 0,
    };

    const wrapper = mount(Tooltip, {
      props,
      slots: {
        default: "<button>Hover me</button>",
      },
    });

    const wrapperElement = wrapper.find(".tooltip-wrapper");
    await wrapperElement.trigger("mouseenter");
    await nextTick();

    const tooltip = wrapper.find(".tooltip");
    expect(tooltip.exists()).toBe(true);
    expect(tooltip.text()).toBe("Tooltip content");
  });

  it("shows tooltip on mouseenter with delay", async () => {
    const props: TooltipProps = {
      content: "Tooltip content",
      delay: 500,
    };

    const wrapper = mount(Tooltip, {
      props,
      slots: {
        default: "<button>Hover me</button>",
      },
    });

    const wrapperElement = wrapper.find(".tooltip-wrapper");
    await wrapperElement.trigger("mouseenter");

    // Tooltip should not be visible immediately
    let tooltip = wrapper.find(".tooltip");
    expect(tooltip.exists()).toBe(false);

    // Fast-forward time
    jest.advanceTimersByTime(500);
    await nextTick();

    // Tooltip should now be visible
    tooltip = wrapper.find(".tooltip");
    expect(tooltip.exists()).toBe(true);
    expect(tooltip.text()).toBe("Tooltip content");
  });

  it("hides tooltip on mouseleave", async () => {
    const props: TooltipProps = {
      content: "Tooltip content",
      delay: 0,
    };

    const wrapper = mount(Tooltip, {
      props,
      slots: {
        default: "<button>Hover me</button>",
      },
    });

    const wrapperElement = wrapper.find(".tooltip-wrapper");

    // Show tooltip
    await wrapperElement.trigger("mouseenter");
    await nextTick();

    let tooltip = wrapper.find(".tooltip");
    expect(tooltip.exists()).toBe(true);

    // Hide tooltip
    await wrapperElement.trigger("mouseleave");
    await nextTick();

    tooltip = wrapper.find(".tooltip");
    expect(tooltip.exists()).toBe(false);
  });

  it("shows tooltip on focusin", async () => {
    const props: TooltipProps = {
      content: "Tooltip content",
      delay: 0,
    };

    const wrapper = mount(Tooltip, {
      props,
      slots: {
        default: "<button>Focus me</button>",
      },
    });

    const wrapperElement = wrapper.find(".tooltip-wrapper");
    await wrapperElement.trigger("focusin");
    await nextTick();

    const tooltip = wrapper.find(".tooltip");
    expect(tooltip.exists()).toBe(true);
    expect(tooltip.text()).toBe("Tooltip content");
  });

  it("hides tooltip on focusout", async () => {
    const props: TooltipProps = {
      content: "Tooltip content",
      delay: 0,
    };

    const wrapper = mount(Tooltip, {
      props,
      slots: {
        default: "<button>Focus me</button>",
      },
    });

    const wrapperElement = wrapper.find(".tooltip-wrapper");

    // Show tooltip
    await wrapperElement.trigger("focusin");
    await nextTick();

    let tooltip = wrapper.find(".tooltip");
    expect(tooltip.exists()).toBe(true);

    // Hide tooltip
    await wrapperElement.trigger("focusout");
    await nextTick();

    tooltip = wrapper.find(".tooltip");
    expect(tooltip.exists()).toBe(false);
  });

  it("does not show tooltip when disabled", async () => {
    const props: TooltipProps = {
      content: "Tooltip content",
      disabled: true,
      delay: 0,
    };

    const wrapper = mount(Tooltip, {
      props,
      slots: {
        default: "<button>Hover me</button>",
      },
    });

    const wrapperElement = wrapper.find(".tooltip-wrapper");
    await wrapperElement.trigger("mouseenter");
    await nextTick();

    const tooltip = wrapper.find(".tooltip");
    expect(tooltip.exists()).toBe(false);
  });

  it("renders content slot when provided", async () => {
    const wrapper = mount(Tooltip, {
      props: {
        delay: 0,
      },
      slots: {
        default: "<button>Hover me</button>",
        content: "<span>Custom tooltip content</span>",
      },
    });

    const wrapperElement = wrapper.find(".tooltip-wrapper");
    await wrapperElement.trigger("mouseenter");
    await nextTick();

    const tooltip = wrapper.find(".tooltip");
    expect(tooltip.exists()).toBe(true);
    expect(tooltip.html()).toContain("Custom tooltip content");
  });

  it("applies correct position classes", async () => {
    const positions: TooltipProps["position"][] = ["top", "bottom", "left", "right"];

    for (const position of positions) {
      const wrapper = mount(Tooltip, {
        props: {
          content: "Tooltip",
          position,
          delay: 0,
        },
        slots: {
          default: "<button>Hover</button>",
        },
      });

      const wrapperElement = wrapper.find(".tooltip-wrapper");
      await wrapperElement.trigger("mouseenter");
      await nextTick();

      const tooltip = wrapper.find(".tooltip");
      expect(tooltip.exists()).toBe(true);
      expect(tooltip.classes()).toContain("tooltip");
      expect(tooltip.classes().some((cls) => cls.includes(`tooltip--${position}`))).toBe(true);
    }
  });

  it("uses top as default position", async () => {
    const wrapper = mount(Tooltip, {
      props: {
        content: "Tooltip",
        delay: 0,
      },
      slots: {
        default: "<button>Hover</button>",
      },
    });

    const wrapperElement = wrapper.find(".tooltip-wrapper");
    await wrapperElement.trigger("mouseenter");
    await nextTick();

    const tooltip = wrapper.find(".tooltip");
    expect(tooltip.classes().some((cls) => cls.includes("tooltip--top"))).toBe(true);
  });

  it("has correct aria attributes", async () => {
    const wrapper = mount(Tooltip, {
      props: {
        content: "Tooltip content",
        delay: 0,
      },
      slots: {
        default: "<button>Hover me</button>",
      },
    });

    const wrapperElement = wrapper.find(".tooltip-wrapper");
    await wrapperElement.trigger("mouseenter");
    await nextTick();

    const tooltip = wrapper.find(".tooltip");
    expect(tooltip.attributes("role")).toBe("tooltip");
    expect(tooltip.attributes("aria-hidden")).toBe("false");
  });

  it("cancels pending timeout on mouseleave before delay completes", async () => {
    const props: TooltipProps = {
      content: "Tooltip content",
      delay: 500,
    };

    const wrapper = mount(Tooltip, {
      props,
      slots: {
        default: "<button>Hover me</button>",
      },
    });

    const wrapperElement = wrapper.find(".tooltip-wrapper");

    // Trigger mouseenter
    await wrapperElement.trigger("mouseenter");

    // Fast-forward partway through delay
    jest.advanceTimersByTime(250);

    // Trigger mouseleave before delay completes
    await wrapperElement.trigger("mouseleave");
    await nextTick();

    // Fast-forward remaining time
    jest.advanceTimersByTime(500);
    await nextTick();

    // Tooltip should not be visible
    const tooltip = wrapper.find(".tooltip");
    expect(tooltip.exists()).toBe(false);
  });

  it("handles rapid mouseenter/mouseleave events", async () => {
    const props: TooltipProps = {
      content: "Tooltip content",
      delay: 100,
    };

    const wrapper = mount(Tooltip, {
      props,
      slots: {
        default: "<button>Hover me</button>",
      },
    });

    const wrapperElement = wrapper.find(".tooltip-wrapper");

    // Rapidly trigger events
    await wrapperElement.trigger("mouseenter");
    jest.advanceTimersByTime(50);
    await wrapperElement.trigger("mouseleave");
    await wrapperElement.trigger("mouseenter");
    jest.advanceTimersByTime(50);
    await wrapperElement.trigger("mouseleave");

    // Fast-forward to ensure no tooltip appears
    jest.advanceTimersByTime(200);
    await nextTick();

    const tooltip = wrapper.find(".tooltip");
    expect(tooltip.exists()).toBe(false);
  });
});


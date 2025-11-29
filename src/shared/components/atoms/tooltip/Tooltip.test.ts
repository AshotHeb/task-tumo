import { describe, it, expect, beforeEach, afterEach, vi } from "@jest/globals";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import Tooltip from "./Tooltip.vue";

describe("Tooltip.vue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("renders with default props", () => {
    const wrapper = mount(Tooltip, {
      slots: {
        default: "<button>Hover me</button>",
        content: "Tooltip content",
      },
    });

    expect(wrapper.find("button").exists()).toBe(true);
    expect(wrapper.find(".tooltip").exists()).toBe(false);
  });

  it("shows tooltip on mouseenter", async () => {
    const wrapper = mount(Tooltip, {
      props: {
        content: "Test tooltip",
      },
      slots: {
        default: "<button>Hover me</button>",
      },
    });

    await wrapper.find(".tooltip-wrapper").trigger("mouseenter");
    await nextTick();

    expect(wrapper.find(".tooltip").exists()).toBe(true);
    expect(wrapper.find(".tooltip").text()).toBe("Test tooltip");
  });

  it("hides tooltip on mouseleave", async () => {
    const wrapper = mount(Tooltip, {
      props: {
        content: "Test tooltip",
      },
      slots: {
        default: "<button>Hover me</button>",
      },
    });

    await wrapper.find(".tooltip-wrapper").trigger("mouseenter");
    await nextTick();
    expect(wrapper.find(".tooltip").exists()).toBe(true);

    await wrapper.find(".tooltip-wrapper").trigger("mouseleave");
    await nextTick();
    expect(wrapper.find(".tooltip").exists()).toBe(false);
  });

  it("respects delay prop", async () => {
    const wrapper = mount(Tooltip, {
      props: {
        content: "Test tooltip",
        delay: 100,
      },
      slots: {
        default: "<button>Hover me</button>",
      },
    });

    await wrapper.find(".tooltip-wrapper").trigger("mouseenter");
    await nextTick();
    expect(wrapper.find(".tooltip").exists()).toBe(false);

    vi.advanceTimersByTime(100);
    await nextTick();
    expect(wrapper.find(".tooltip").exists()).toBe(true);
  });

  it("does not show tooltip when disabled", async () => {
    const wrapper = mount(Tooltip, {
      props: {
        content: "Test tooltip",
        disabled: true,
      },
      slots: {
        default: "<button>Hover me</button>",
      },
    });

    await wrapper.find(".tooltip-wrapper").trigger("mouseenter");
    await nextTick();
    expect(wrapper.find(".tooltip").exists()).toBe(false);
  });

  it("applies correct position class", async () => {
    const positions = ["top", "bottom", "left", "right"] as const;

    for (const position of positions) {
      const wrapper = mount(Tooltip, {
        props: {
          content: "Test tooltip",
          position,
        },
        slots: {
          default: "<button>Hover me</button>",
        },
      });

      await wrapper.find(".tooltip-wrapper").trigger("mouseenter");
      await nextTick();

      const tooltip = wrapper.find(".tooltip");
      expect(tooltip.classes()).toContain(`tooltip--${position}`);
    }
  });

  it("shows tooltip on focusin", async () => {
    const wrapper = mount(Tooltip, {
      props: {
        content: "Test tooltip",
      },
      slots: {
        default: "<button>Focus me</button>",
      },
    });

    await wrapper.find(".tooltip-wrapper").trigger("focusin");
    await nextTick();

    expect(wrapper.find(".tooltip").exists()).toBe(true);
  });

  it("hides tooltip on focusout", async () => {
    const wrapper = mount(Tooltip, {
      props: {
        content: "Test tooltip",
      },
      slots: {
        default: "<button>Focus me</button>",
      },
    });

    await wrapper.find(".tooltip-wrapper").trigger("focusin");
    await nextTick();
    expect(wrapper.find(".tooltip").exists()).toBe(true);

    await wrapper.find(".tooltip-wrapper").trigger("focusout");
    await nextTick();
    expect(wrapper.find(".tooltip").exists()).toBe(false);
  });

  it("uses content slot when provided", async () => {
    const wrapper = mount(Tooltip, {
      slots: {
        default: "<button>Hover me</button>",
        content: "<span>Custom content</span>",
      },
    });

    await wrapper.find(".tooltip-wrapper").trigger("mouseenter");
    await nextTick();

    expect(wrapper.find(".tooltip span").exists()).toBe(true);
    expect(wrapper.find(".tooltip span").text()).toBe("Custom content");
  });
});


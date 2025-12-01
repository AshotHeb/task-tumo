import {
  describe,
  it,
  expect,
  jest,
  beforeEach,
  afterEach,
} from "@jest/globals";
import { mount } from "@vue/test-utils";
import { defineComponent } from "vue";
import { createPinia, setActivePinia } from "pinia";
import { useTheme } from "./index";
import { useThemeStore } from "@/stores/theme";

// Mock window.matchMedia
const mockMatchMedia = jest.fn((query: string) => {
  return {
    matches: query === "(prefers-color-scheme: dark)",
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  } as MediaQueryList;
});

describe("useTheme", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    // Setup window.matchMedia mock
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: mockMatchMedia,
    });
    // Clear localStorage
    localStorage.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("returns theme mode from store", () => {
    const TestComponent = defineComponent({
      setup() {
        const { mode } = useTheme();
        return { mode };
      },
      template: "<div>{{ mode }}</div>",
    });

    const wrapper = mount(TestComponent);
    const store = useThemeStore();

    expect(wrapper.vm.mode).toBe(store.mode);
    wrapper.unmount();
  });

  it("returns setTheme function", () => {
    const TestComponent = defineComponent({
      setup() {
        const { setTheme } = useTheme();
        return { setTheme };
      },
      template: "<div>Test</div>",
    });

    const wrapper = mount(TestComponent);
    const store = useThemeStore();

    expect(typeof wrapper.vm.setTheme).toBe("function");

    wrapper.vm.setTheme("dark");
    expect(store.mode).toBe("dark");

    wrapper.vm.setTheme("light");
    expect(store.mode).toBe("light");

    wrapper.unmount();
  });

  it("returns toggleTheme function", () => {
    const TestComponent = defineComponent({
      setup() {
        const { toggleTheme } = useTheme();
        return { toggleTheme };
      },
      template: "<div>Test</div>",
    });

    const wrapper = mount(TestComponent);
    const store = useThemeStore();

    expect(typeof wrapper.vm.toggleTheme).toBe("function");

    const initialMode = store.mode;
    wrapper.vm.toggleTheme();

    if (initialMode === "dark") {
      expect(store.mode).toBe("light");
    } else {
      expect(store.mode).toBe("dark");
    }

    wrapper.unmount();
  });

  it("isDark computed reflects dark mode", () => {
    const TestComponent = defineComponent({
      setup() {
        const { isDark, setTheme } = useTheme();
        return { isDark, setTheme };
      },
      template: "<div>{{ isDark }}</div>",
    });

    const wrapper = mount(TestComponent);

    wrapper.vm.setTheme("dark");
    expect(wrapper.vm.isDark).toBe(true);

    wrapper.vm.setTheme("light");
    expect(wrapper.vm.isDark).toBe(false);

    wrapper.unmount();
  });

  it("isLight computed reflects light mode", () => {
    const TestComponent = defineComponent({
      setup() {
        const { isLight, setTheme } = useTheme();
        return { isLight, setTheme };
      },
      template: "<div>{{ isLight }}</div>",
    });

    const wrapper = mount(TestComponent);

    wrapper.vm.setTheme("light");
    expect(wrapper.vm.isLight).toBe(true);

    wrapper.vm.setTheme("dark");
    expect(wrapper.vm.isLight).toBe(false);

    wrapper.unmount();
  });

  it("mode computed is reactive", async () => {
    const TestComponent = defineComponent({
      setup() {
        const { mode, setTheme } = useTheme();
        return { mode, setTheme };
      },
      template: "<div>{{ mode }}</div>",
    });

    const wrapper = mount(TestComponent);

    expect(wrapper.vm.mode).toBeDefined();

    wrapper.vm.setTheme("dark");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.mode).toBe("dark");

    wrapper.vm.setTheme("light");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.mode).toBe("light");

    wrapper.unmount();
  });
});

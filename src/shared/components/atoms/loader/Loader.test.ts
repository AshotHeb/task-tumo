import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from "@jest/globals";
import { mount } from "@vue/test-utils";
import Loader from "./Loader.vue";
import type { LoaderProps } from "./types";

describe("Loader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders loader element with default props", () => {
    const wrapper = mount(Loader, {
      props: {},
    });

    const loader = wrapper.find(".loader");
    expect(loader.exists()).toBe(true);
  });

  it("renders three dots", () => {
    const wrapper = mount(Loader);

    const dots = wrapper.findAll(".loader__dot");
    expect(dots.length).toBe(3);
  });

  it("applies correct size class for small loader", () => {
    const props: LoaderProps = {
      size: "sm",
    };

    const wrapper = mount(Loader, {
      props,
    });

    const loader = wrapper.find(".loader");
    expect(loader.classes()).toContain("loader--sm");
  });

  it("applies correct size class for medium loader", () => {
    const props: LoaderProps = {
      size: "md",
    };

    const wrapper = mount(Loader, {
      props,
    });

    const loader = wrapper.find(".loader");
    expect(loader.classes()).toContain("loader--md");
  });

  it("applies correct size class for large loader", () => {
    const props: LoaderProps = {
      size: "lg",
    };

    const wrapper = mount(Loader, {
      props,
    });

    const loader = wrapper.find(".loader");
    expect(loader.classes()).toContain("loader--lg");
  });

  it("uses md as default size", () => {
    const wrapper = mount(Loader, {
      props: {},
    });

    const loader = wrapper.find(".loader");
    expect(loader.classes()).toContain("loader--md");
  });

  it("forwards attributes to loader element", () => {
    const wrapper = mount(Loader, {
      attrs: {
        "data-testid": "test-loader",
        "aria-label": "Loading",
      },
    });

    const loader = wrapper.find(".loader");
    expect(loader.attributes("data-testid")).toBe("test-loader");
    expect(loader.attributes("aria-label")).toBe("Loading");
  });

  it("renders all dots with correct classes", () => {
    const wrapper = mount(Loader);

    const dots = wrapper.findAll(".loader__dot");
    dots.forEach((dot) => {
      expect(dot.classes()).toContain("loader__dot");
    });
  });
});


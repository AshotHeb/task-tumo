import {
  describe,
  it,
  expect,
  jest,
  beforeEach,
  afterEach,
} from "@jest/globals";
import { mount } from "@vue/test-utils";
import Favorite from "./Favorite.vue";
import type { FavoriteProps } from "./types";

describe("Favorite", () => {
  let onClick: ReturnType<typeof jest.fn>;

  beforeEach(() => {
    onClick = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders button element", () => {
    const props: FavoriteProps = {
      isFavorite: false,
      onClick,
    };

    const wrapper = mount(Favorite, {
      props,
    });

    const button = wrapper.find("button");
    expect(button.exists()).toBe(true);
    expect(button.attributes("type")).toBe("button");
  });

  it("calls onClick handler when clicked", async () => {
    const props: FavoriteProps = {
      isFavorite: false,
      onClick,
    };

    const wrapper = mount(Favorite, {
      props,
    });

    const button = wrapper.find("button");
    await button.trigger("click");

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("stops event propagation on click", async () => {
    const props: FavoriteProps = {
      isFavorite: false,
      onClick,
    };

    const wrapper = mount(Favorite, {
      props,
      global: {
        stubs: {
          Heart: {
            template: '<svg data-testid="heart-icon"></svg>',
          },
        },
      },
    });

    const button = wrapper.find("button");
    const clickEvent = new MouseEvent("click", { bubbles: true });
    const stopPropagationSpy = jest.spyOn(clickEvent, "stopPropagation");

    await button.element.dispatchEvent(clickEvent);

    expect(stopPropagationSpy).toHaveBeenCalled();
  });

  it("shows correct aria-label when not favorited", () => {
    const props: FavoriteProps = {
      isFavorite: false,
      onClick,
    };

    const wrapper = mount(Favorite, {
      props,
    });

    const button = wrapper.find("button");
    expect(button.attributes("aria-label")).toBe("Add to favorites");
  });

  it("shows correct aria-label when favorited", () => {
    const props: FavoriteProps = {
      isFavorite: true,
      onClick,
    };

    const wrapper = mount(Favorite, {
      props,
    });

    const button = wrapper.find("button");
    expect(button.attributes("aria-label")).toBe("Remove from favorites");
  });

  it("applies favorite--active class when isFavorite is true", () => {
    const props: FavoriteProps = {
      isFavorite: true,
      onClick,
    };

    const wrapper = mount(Favorite, {
      props,
      global: {
        stubs: {
          Heart: {
            template: "<svg></svg>",
          },
        },
      },
    });

    const button = wrapper.find("button");
    expect(button.classes()).toContain("favorite");
    expect(button.classes()).toContain("favorite--active");
  });

  it("does not apply favorite--active class when isFavorite is false", () => {
    const props: FavoriteProps = {
      isFavorite: false,
      onClick,
    };

    const wrapper = mount(Favorite, {
      props,
      global: {
        stubs: {
          Heart: {
            template: "<svg></svg>",
          },
        },
      },
    });

    const button = wrapper.find("button");
    expect(button.classes()).toContain("favorite");
    expect(button.classes()).not.toContain("favorite--active");
  });

  it("renders Heart icon with correct props when not favorited", () => {
    const props: FavoriteProps = {
      isFavorite: false,
      onClick,
    };

    const wrapper = mount(Favorite, {
      props,
    });

    const heartIcon = wrapper.findComponent({ name: "Heart" });
    expect(heartIcon.exists()).toBe(true);
    expect(heartIcon.props("size")).toBe(24);
    expect(heartIcon.props("fill")).toBe("none");
    expect(heartIcon.props("color")).toBe("#6b7280");
  });

  it("renders Heart icon with correct props when favorited", () => {
    const props: FavoriteProps = {
      isFavorite: true,
      onClick,
    };

    const wrapper = mount(Favorite, {
      props,
    });

    const heartIcon = wrapper.findComponent({ name: "Heart" });
    expect(heartIcon.exists()).toBe(true);
    expect(heartIcon.props("size")).toBe(24);
    expect(heartIcon.props("fill")).toBe("#ef4444");
    expect(heartIcon.props("color")).toBe("#ef4444");
  });
});

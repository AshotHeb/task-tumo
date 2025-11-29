import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { mount } from "@vue/test-utils";
import { ref, nextTick } from "vue";
import TopSection from "./TopSection.vue";
import type { Genre } from "@/api/entities/movies/types";
import type { MoviesFilterOptions } from "@/stores/movies/types";

// Mock Pinia stores
const mockSetSearch = jest.fn();
const mockSetSelectedGenres = jest.fn();

const mockSearch = ref("");
const mockGenres = ref<Genre[]>([]);
const mockFilterOptions = ref<MoviesFilterOptions>({
  search: "",
  selectedGenres: [],
});

jest.mock("@/stores/movies", () => ({
  useMoviesStore: jest.fn(() => ({
    search: mockSearch,
    genres: mockGenres,
    filterOptions: mockFilterOptions,
    setSearch: mockSetSearch,
    setSelectedGenres: mockSetSelectedGenres,
  })),
}));

// Mock child components
jest.mock("@/shared/components/atoms/input", () => ({
  Input: {
    name: "Input",
    template:
      '<input class="input-mock" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
    props: ["modelValue", "type", "placeholder", "class"],
    emits: ["update:modelValue"],
  },
}));

jest.mock("@/shared/components/molecules/select", () => ({
  Select: {
    name: "Select",
    template: '<div class="select-mock" @click="handleClick"><slot /></div>',
    props: ["modelValue", "options", "placeholder", "class"],
    emits: ["update:modelValue"],
    setup(props: { modelValue: string[] }, { emit }: any) {
      return {
        handleClick: () => {
          // Simulate Select component behavior
          if (props.modelValue) {
            emit("update:modelValue", props.modelValue);
          }
        },
      };
    },
  },
}));

describe("TopSection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearch.value = "";
    mockGenres.value = [];
    mockFilterOptions.value = {
      search: "",
      selectedGenres: [],
    };
  });

  describe("Component Rendering", () => {
    it("should render Input and Select components", () => {
      const wrapper = mount(TopSection);

      expect(wrapper.find(".input-mock").exists()).toBe(true);
      expect(wrapper.find(".select-mock").exists()).toBe(true);
    });

    it("should render Input with correct props", () => {
      const wrapper = mount(TopSection);
      const input = wrapper.findComponent({ name: "Input" });

      expect(input.props("type")).toBe("search");
      expect(input.props("placeholder")).toBe("Search movies...");
      expect(input.props("class")).toBe("top-section__input");
    });

    it("should render Select with correct props", () => {
      const wrapper = mount(TopSection);
      const select = wrapper.findComponent({ name: "Select" });

      expect(select.props("placeholder")).toBe("Filter by...");
      expect(select.props("class")).toBe("top-section__select");
    });
  });

  describe("Search Input", () => {
    it("should bind searchValue to Input component", async () => {
      mockSearch.value = "test search";
      const wrapper = mount(TopSection);

      await nextTick();

      const input = wrapper.findComponent({ name: "Input" });
      expect(input.props("modelValue")).toBe("test search");
    });

    it("should call setSearch when Input value changes", async () => {
      const wrapper = mount(TopSection);
      const input = wrapper.findComponent({ name: "Input" });

      await input.setValue("new search");

      expect(mockSetSearch).toHaveBeenCalledWith("new search");
    });

    it("should update Input value when store search changes", async () => {
      const wrapper = mount(TopSection);

      mockSearch.value = "updated search";
      await nextTick();

      const input = wrapper.findComponent({ name: "Input" });
      expect(input.props("modelValue")).toBe("updated search");
    });
  });

  describe("Genre Options", () => {
    it("should map genres to SelectOption format", async () => {
      mockGenres.value = [
        { id: 1, name: "Action" },
        { id: 2, name: "Drama" },
        { id: 3, name: "Comedy" },
      ];

      const wrapper = mount(TopSection);
      await nextTick();

      const select = wrapper.findComponent({ name: "Select" });
      const options = select.props("options");

      expect(options).toEqual([
        { value: "1", label: "Action" },
        { value: "2", label: "Drama" },
        { value: "3", label: "Comedy" },
      ]);
    });

    it("should handle empty genres array", async () => {
      mockGenres.value = [];
      const wrapper = mount(TopSection);
      await nextTick();

      const select = wrapper.findComponent({ name: "Select" });
      const options = select.props("options");

      expect(options).toEqual([]);
    });

    it("should update genre options when store genres change", async () => {
      const wrapper = mount(TopSection);
      await nextTick();

      mockGenres.value = [
        { id: 4, name: "Horror" },
        { id: 5, name: "Thriller" },
      ];
      await nextTick();

      const select = wrapper.findComponent({ name: "Select" });
      const options = select.props("options");

      expect(options).toEqual([
        { value: "4", label: "Horror" },
        { value: "5", label: "Thriller" },
      ]);
    });
  });

  describe("Selected Filters", () => {
    it("should bind selectedFilters to Select component", async () => {
      mockFilterOptions.value = {
        search: "",
        selectedGenres: [1, 2, 3],
      };

      const wrapper = mount(TopSection);
      await nextTick();

      const select = wrapper.findComponent({ name: "Select" });
      expect(select.props("modelValue")).toEqual(["1", "2", "3"]);
    });

    it("should convert selectedGenres to string array", async () => {
      mockFilterOptions.value = {
        search: "",
        selectedGenres: [5, 10, 15],
      };

      const wrapper = mount(TopSection);
      await nextTick();

      const select = wrapper.findComponent({ name: "Select" });
      const modelValue = select.props("modelValue");

      expect(modelValue).toEqual(["5", "10", "15"]);
      expect(modelValue.every((val: string) => typeof val === "string")).toBe(
        true
      );
    });

    it("should handle empty selectedGenres", async () => {
      mockFilterOptions.value = {
        search: "",
        selectedGenres: [],
      };

      const wrapper = mount(TopSection);
      await nextTick();

      const select = wrapper.findComponent({ name: "Select" });
      expect(select.props("modelValue")).toEqual([]);
    });

    it("should call setSelectedGenres when Select value changes", async () => {
      const wrapper = mount(TopSection);
      const select = wrapper.findComponent({ name: "Select" });

      await select.setValue(["1", "2", "3"]);

      expect(mockSetSelectedGenres).toHaveBeenCalledWith([1, 2, 3]);
    });

    it("should convert string array to number array when setting selectedGenres", async () => {
      const wrapper = mount(TopSection);
      const select = wrapper.findComponent({ name: "Select" });

      await select.setValue(["10", "20", "30"]);

      expect(mockSetSelectedGenres).toHaveBeenCalledWith([10, 20, 30]);
      const firstCallArgs = mockSetSelectedGenres.mock.calls[0][0] as number[];
      expect(firstCallArgs.every((id: number) => typeof id === "number")).toBe(
        true
      );
    });

    it("should update Select value when store selectedGenres changes", async () => {
      const wrapper = mount(TopSection);
      await nextTick();

      mockFilterOptions.value.selectedGenres = [7, 8, 9];
      await nextTick();

      const select = wrapper.findComponent({ name: "Select" });
      expect(select.props("modelValue")).toEqual(["7", "8", "9"]);
    });
  });

  describe("Store Interactions", () => {
    it("should use search from store", async () => {
      mockSearch.value = "store search value";
      const wrapper = mount(TopSection);
      await nextTick();

      const input = wrapper.findComponent({ name: "Input" });
      expect(input.props("modelValue")).toBe("store search value");
    });

    it("should use genres from store", async () => {
      mockGenres.value = [
        { id: 1, name: "Action" },
        { id: 2, name: "Drama" },
      ];

      const wrapper = mount(TopSection);
      await nextTick();

      const select = wrapper.findComponent({ name: "Select" });
      const options = select.props("options");

      expect(options).toHaveLength(2);
      expect(options[0]).toEqual({ value: "1", label: "Action" });
    });

    it("should use filterOptions.selectedGenres from store", async () => {
      mockFilterOptions.value = {
        search: "",
        selectedGenres: [1, 2],
      };

      const wrapper = mount(TopSection);
      await nextTick();

      const select = wrapper.findComponent({ name: "Select" });
      expect(select.props("modelValue")).toEqual(["1", "2"]);
    });

    it("should call setSearch with correct value", async () => {
      const wrapper = mount(TopSection);
      const input = wrapper.findComponent({ name: "Input" });

      await input.setValue("test query");

      expect(mockSetSearch).toHaveBeenCalledTimes(1);
      expect(mockSetSearch).toHaveBeenCalledWith("test query");
    });

    it("should call setSelectedGenres with correct genre IDs", async () => {
      const wrapper = mount(TopSection);
      const select = wrapper.findComponent({ name: "Select" });

      await select.setValue(["1", "2", "3"]);

      expect(mockSetSelectedGenres).toHaveBeenCalledTimes(1);
      expect(mockSetSelectedGenres).toHaveBeenCalledWith([1, 2, 3]);
    });
  });

  describe("Edge Cases", () => {
    it("should handle single genre selection", async () => {
      const wrapper = mount(TopSection);
      const select = wrapper.findComponent({ name: "Select" });

      await select.setValue(["5"]);

      expect(mockSetSelectedGenres).toHaveBeenCalledWith([5]);
    });

    it("should handle empty string in search", async () => {
      const wrapper = mount(TopSection);
      const input = wrapper.findComponent({ name: "Input" });

      await input.setValue("");

      expect(mockSetSearch).toHaveBeenCalledWith("");
    });

    it("should handle empty array in selectedFilters", async () => {
      const wrapper = mount(TopSection);
      const select = wrapper.findComponent({ name: "Select" });

      await select.setValue([]);

      expect(mockSetSelectedGenres).toHaveBeenCalledWith([]);
    });

    it("should handle large genre IDs", async () => {
      const wrapper = mount(TopSection);
      const select = wrapper.findComponent({ name: "Select" });

      await select.setValue(["999", "1000", "1001"]);

      expect(mockSetSelectedGenres).toHaveBeenCalledWith([999, 1000, 1001]);
    });

    it("should handle genres with special characters in names", async () => {
      mockGenres.value = [
        { id: 1, name: "Sci-Fi" },
        { id: 2, name: "Action & Adventure" },
      ];

      const wrapper = mount(TopSection);
      await nextTick();

      const select = wrapper.findComponent({ name: "Select" });
      const options = select.props("options");

      expect(options).toEqual([
        { value: "1", label: "Sci-Fi" },
        { value: "2", label: "Action & Adventure" },
      ]);
    });
  });
});

import {
  describe,
  it,
  expect,
  jest,
  beforeEach,
  afterEach,
} from "@jest/globals";
import { mount } from "@vue/test-utils";
import { ref, nextTick } from "vue";
import MovieDetails from "./MovieDetails.vue";
import type { MovieDetails as MovieDetailsType } from "@/api/entities/movies/types";

// Mock vue-router
const mockPush = jest.fn();
interface MockRouteParams {
  id: string | number | null | undefined;
}

const mockRoute: { params: MockRouteParams } = {
  params: { id: "123" },
};

jest.mock("vue-router", () => ({
  useRoute: () => mockRoute,
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock Pinia stores
const mockFetchMovieDetails = jest.fn<() => Promise<void>>();
const mockSetCurrentMovieId = jest.fn();
const mockToggleFavorite = jest.fn();
const mockIsFavorite = jest.fn();

const mockCurrentMovie = ref<MovieDetailsType | undefined>(undefined);
const mockIsFetchMovieDetailsLoading = ref(false);

jest.mock("@/stores/movie-details", () => ({
  useMovieDetailsStore: jest.fn(() => ({
    currentMovie: mockCurrentMovie,
    isFetchMovieDetailsLoading: mockIsFetchMovieDetailsLoading,
    fetchMovieDetails: mockFetchMovieDetails,
    setCurrentMovieId: mockSetCurrentMovieId,
  })),
}));

const mockFavoritesStore = {
  isFavorite: mockIsFavorite,
  toggleFavorite: mockToggleFavorite,
};

jest.mock("@/stores/favorites", () => ({
  useFavoritesStore: jest.fn(() => mockFavoritesStore),
}));

// Mock child components
jest.mock("@/shared/components/atoms/loader", () => ({
  Loader: {
    name: "Loader",
    template: '<div class="loader-mock">Loader</div>',
  },
}));

jest.mock("@/shared/components/atoms/text", () => ({
  Text: {
    name: "Text",
    template: "<span><slot /></span>",
    props: ["as", "size", "weight", "class"],
  },
}));

jest.mock("@/shared/components/atoms/favorite", () => ({
  Favorite: {
    name: "Favorite",
    template:
      '<button class="favorite-mock" @click="onClick"><slot /></button>',
    props: ["isFavorite", "onClick"],
  },
}));

jest.mock("./trailers", () => ({
  Trailers: {
    name: "Trailers",
    template: '<div class="trailers-mock">Trailers</div>',
  },
}));

// Mock lucide-vue-next
jest.mock("lucide-vue-next", () => ({
  ArrowLeft: {
    name: "ArrowLeft",
    template: '<svg class="arrow-left-mock"></svg>',
    props: ["size"],
  },
}));

describe("MovieDetails", () => {
  // Mock window.scrollTo
  const originalScrollTo = window.scrollTo;
  const mockScrollTo = jest.fn();

  // Helper function to create mock movie data
  const createMockMovie = (
    overrides?: Partial<MovieDetailsType>
  ): MovieDetailsType => {
    return {
      id: 123,
      title: "Test Movie",
      overview: "Test overview",
      poster_path: "/test-poster.jpg",
      backdrop_path: "/test-backdrop.jpg",
      release_date: "2023-01-15",
      vote_average: 8.5,
      vote_count: 1000,
      popularity: 100,
      genre_ids: [1, 2],
      adult: false,
      original_language: "en",
      original_title: "Test Movie",
      genres: [
        { id: 1, name: "Action" },
        { id: 2, name: "Drama" },
      ],
      runtime: 120,
      budget: 1000000,
      revenue: 5000000,
      production_companies: [
        { id: 1, name: "Company 1", logo_path: null, origin_country: "US" },
      ],
      production_countries: [{ iso_3166_1: "US", name: "United States" }],
      spoken_languages: [
        { english_name: "English", iso_639_1: "en", name: "English" },
      ],
      status: "Released",
      tagline: "Test tagline",
      homepage: "https://example.com",
      imdb_id: "tt123456",
      belongs_to_collection: null,
      ...overrides,
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    window.scrollTo = mockScrollTo;
    mockCurrentMovie.value = undefined;
    mockIsFetchMovieDetailsLoading.value = false;
    mockIsFavorite.mockReturnValue(false);
    mockRoute.params.id = "123";
  });

  afterEach(() => {
    window.scrollTo = originalScrollTo;
  });

  describe("Loading State", () => {
    it("should show loader when fetching movie details", async () => {
      mockIsFetchMovieDetailsLoading.value = true;
      mockCurrentMovie.value = undefined;

      const wrapper = mount(MovieDetails);

      await nextTick();

      expect(wrapper.find(".loader-mock").exists()).toBe(true);
      expect(wrapper.find(".movie-details__loading").exists()).toBe(true);
    });

    it("should show loader when movie ID exists but movie is not loaded", async () => {
      mockIsFetchMovieDetailsLoading.value = false;
      mockCurrentMovie.value = undefined;
      mockRoute.params.id = "123";

      const wrapper = mount(MovieDetails);

      await nextTick();

      expect(wrapper.find(".loader-mock").exists()).toBe(true);
    });
  });

  describe("Movie Display", () => {
    it("should render movie content when movie exists", async () => {
      const mockMovie = createMockMovie();
      mockCurrentMovie.value = mockMovie;
      mockIsFetchMovieDetailsLoading.value = false;

      const wrapper = mount(MovieDetails);

      await nextTick();

      expect(wrapper.find(".movie-details__content").exists()).toBe(true);
      expect(wrapper.text()).toContain("Test Movie");
      expect(wrapper.text()).toContain("Test tagline");
      expect(wrapper.text()).toContain("Test overview");
    });

    it("should display movie title", async () => {
      const mockMovie = createMockMovie({ title: "My Test Movie" });
      mockCurrentMovie.value = mockMovie;
      mockIsFetchMovieDetailsLoading.value = false;

      const wrapper = mount(MovieDetails);

      await nextTick();

      expect(wrapper.text()).toContain("My Test Movie");
    });

    it("should display movie poster image when poster_path exists", async () => {
      const mockMovie = createMockMovie({
        poster_path: "/test-poster.jpg",
      });
      mockCurrentMovie.value = mockMovie;
      mockIsFetchMovieDetailsLoading.value = false;

      const wrapper = mount(MovieDetails);

      await nextTick();

      const posterImage = wrapper.find(".movie-details__poster-image");
      expect(posterImage.exists()).toBe(true);
      expect(posterImage.attributes("src")).toBe(
        "https://image.tmdb.org/t/p/w500/test-poster.jpg"
      );
      expect(posterImage.attributes("alt")).toBe("Test Movie");
    });

    it("should display 'No Image' placeholder when poster_path is null", async () => {
      const mockMovie = createMockMovie({ poster_path: null });
      mockCurrentMovie.value = mockMovie;
      mockIsFetchMovieDetailsLoading.value = false;

      const wrapper = mount(MovieDetails);

      await nextTick();

      expect(wrapper.find(".movie-details__no-poster").exists()).toBe(true);
      expect(wrapper.text()).toContain("No Image");
    });

    it("should display rating and vote count", async () => {
      const mockMovie = createMockMovie({
        vote_average: 8.5,
        vote_count: 1500,
      });
      mockCurrentMovie.value = mockMovie;
      mockIsFetchMovieDetailsLoading.value = false;

      const wrapper = mount(MovieDetails);

      await nextTick();

      expect(wrapper.text()).toContain("8.5");
      expect(wrapper.text()).toContain("1,500");
    });

    it("should display release date", async () => {
      const mockMovie = createMockMovie({ release_date: "2023-01-15" });
      mockCurrentMovie.value = mockMovie;
      mockIsFetchMovieDetailsLoading.value = false;

      const wrapper = mount(MovieDetails);

      await nextTick();

      expect(wrapper.text()).toContain("Release Date:");
      expect(wrapper.text()).toContain("January 15, 2023");
    });

    it("should display runtime", async () => {
      const mockMovie = createMockMovie({ runtime: 120 });
      mockCurrentMovie.value = mockMovie;
      mockIsFetchMovieDetailsLoading.value = false;

      const wrapper = mount(MovieDetails);

      await nextTick();

      expect(wrapper.text()).toContain("Runtime:");
      expect(wrapper.text()).toContain("2h 0m");
    });

    it("should display genres", async () => {
      const mockMovie = createMockMovie({
        genres: [
          { id: 1, name: "Action" },
          { id: 2, name: "Drama" },
        ],
      });
      mockCurrentMovie.value = mockMovie;
      mockIsFetchMovieDetailsLoading.value = false;

      const wrapper = mount(MovieDetails);

      await nextTick();

      expect(wrapper.text()).toContain("Genres:");
      expect(wrapper.text()).toContain("Action");
      expect(wrapper.text()).toContain("Drama");
    });

    it("should display production companies", async () => {
      const mockMovie = createMockMovie({
        production_companies: [
          { id: 1, name: "Company 1", logo_path: null, origin_country: "US" },
          { id: 2, name: "Company 2", logo_path: null, origin_country: "UK" },
        ],
      });
      mockCurrentMovie.value = mockMovie;
      mockIsFetchMovieDetailsLoading.value = false;

      const wrapper = mount(MovieDetails);

      await nextTick();

      expect(wrapper.text()).toContain("Production Companies:");
      expect(wrapper.text()).toContain("Company 1");
      expect(wrapper.text()).toContain("Company 2");
    });

    it("should display production countries", async () => {
      const mockMovie = createMockMovie({
        production_countries: [
          { iso_3166_1: "US", name: "United States" },
          { iso_3166_1: "UK", name: "United Kingdom" },
        ],
      });
      mockCurrentMovie.value = mockMovie;
      mockIsFetchMovieDetailsLoading.value = false;

      const wrapper = mount(MovieDetails);

      await nextTick();

      expect(wrapper.text()).toContain("Production Countries:");
      expect(wrapper.text()).toContain("United States");
      expect(wrapper.text()).toContain("United Kingdom");
    });
  });

  describe("Error State", () => {
    it("should show 'Movie not found' when movie is null and not loading", async () => {
      mockCurrentMovie.value = undefined;
      mockIsFetchMovieDetailsLoading.value = false;
      // Set movieId to null to trigger error state
      // Error shows when !isLoading && !movie
      // isLoading = isFetchMovieDetailsLoading || (!movie && movieId)
      // So if movieId is falsy, isLoading will be false (assuming isFetchMovieDetailsLoading is false)
      mockRoute.params.id = null;
      mockFetchMovieDetails.mockResolvedValue(undefined);

      const wrapper = mount(MovieDetails);

      await nextTick();
      await nextTick(); // Wait for async operations

      // Error state shows when !isLoading && !movie
      // With movieId = null, isLoading should be false (if isFetchMovieDetailsLoading is false)
      expect(wrapper.find(".movie-details__error").exists()).toBe(true);
      expect(wrapper.text()).toContain("Movie not found");
    });
  });

  describe("Route Parameter Handling", () => {
    it("should extract movie ID from route params as string", async () => {
      mockRoute.params.id = "456";

      mount(MovieDetails);

      await nextTick();

      expect(mockSetCurrentMovieId).toHaveBeenCalledWith(456);
      expect(mockFetchMovieDetails).toHaveBeenCalledWith(456);
    });

    it("should handle numeric route params", async () => {
      mockRoute.params.id = "789";

      mount(MovieDetails);

      await nextTick();

      expect(mockSetCurrentMovieId).toHaveBeenCalledWith(789);
      expect(mockFetchMovieDetails).toHaveBeenCalledWith(789);
    });

    it("should handle invalid route params", async () => {
      mockRoute.params.id = "invalid";

      mount(MovieDetails);

      await nextTick();

      // Should still attempt to parse, but will result in NaN
      expect(mockSetCurrentMovieId).toHaveBeenCalled();
    });
  });

  describe("Store Interactions", () => {
    it("should call fetchMovieDetails with correct movie ID on mount", async () => {
      mockRoute.params.id = "123";

      mount(MovieDetails);

      await nextTick();

      expect(mockFetchMovieDetails).toHaveBeenCalledWith(123);
    });

    it("should call setCurrentMovieId with correct ID on mount", async () => {
      mockRoute.params.id = "456";

      mount(MovieDetails);

      await nextTick();

      expect(mockSetCurrentMovieId).toHaveBeenCalledWith(456);
    });

    it("should use currentMovie from store", async () => {
      const mockMovie = createMockMovie();
      mockCurrentMovie.value = mockMovie;
      mockIsFetchMovieDetailsLoading.value = false;

      const wrapper = mount(MovieDetails);

      await nextTick();

      expect(wrapper.text()).toContain(mockMovie.title);
    });

    it("should use isFetchMovieDetailsLoading from store", async () => {
      mockIsFetchMovieDetailsLoading.value = true;

      const wrapper = mount(MovieDetails);

      await nextTick();

      expect(wrapper.find(".loader-mock").exists()).toBe(true);
    });
  });

  describe("Scroll to Top Functionality", () => {
    it("should scroll to top on component mount", async () => {
      mockCurrentMovie.value = createMockMovie();
      mockIsFetchMovieDetailsLoading.value = false;

      mount(MovieDetails);

      await nextTick();
      await nextTick(); // Wait for async operations

      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: "instant",
      });
    });

    it("should scroll to top when movie ID changes", async () => {
      mockCurrentMovie.value = createMockMovie({ id: 123 });
      mockIsFetchMovieDetailsLoading.value = false;
      mockRoute.params.id = "123";

      const wrapper = mount(MovieDetails);

      await nextTick();
      mockScrollTo.mockClear();

      // Simulate route change
      mockRoute.params.id = "456";
      await wrapper.vm.$forceUpdate();
      await nextTick();

      expect(mockScrollTo).toHaveBeenCalled();
    });
  });

  describe("User Interactions", () => {
    it("should navigate to home when back button is clicked", async () => {
      const mockMovie = createMockMovie();
      mockCurrentMovie.value = mockMovie;
      mockIsFetchMovieDetailsLoading.value = false;

      const wrapper = mount(MovieDetails);

      await nextTick();

      const backButton = wrapper.find(".movie-details__back-button");
      await backButton.trigger("click");

      expect(mockPush).toHaveBeenCalledWith("/");
    });

    it("should call toggleFavorite when favorite button is clicked", async () => {
      const mockMovie = createMockMovie();
      mockCurrentMovie.value = mockMovie;
      mockIsFetchMovieDetailsLoading.value = false;

      const wrapper = mount(MovieDetails);

      await nextTick();

      // Find the Favorite component and get its onClick prop
      const favoriteComponent = wrapper.findComponent({ name: "Favorite" });
      expect(favoriteComponent.exists()).toBe(true);

      const onClickHandler = favoriteComponent.props("onClick");
      expect(onClickHandler).toBeDefined();

      // Call the onClick handler directly
      onClickHandler();

      expect(mockToggleFavorite).toHaveBeenCalledWith(mockMovie);
    });

    it("should display favorite state correctly", async () => {
      const mockMovie = createMockMovie();
      mockCurrentMovie.value = mockMovie;
      mockIsFetchMovieDetailsLoading.value = false;
      mockIsFavorite.mockReturnValue(true);

      const wrapper = mount(MovieDetails);

      await nextTick();

      const favoriteButton = wrapper.find(".favorite-mock");
      expect(favoriteButton.exists()).toBe(true);
      // The isFavorite prop should be passed to Favorite component
      expect(mockIsFavorite).toHaveBeenCalledWith(mockMovie.id);
    });
  });

  describe("Conditional Rendering", () => {
    it("should show tagline only if it exists", async () => {
      const mockMovieWithTagline = createMockMovie({
        tagline: "Test tagline",
      });
      mockCurrentMovie.value = mockMovieWithTagline;
      mockIsFetchMovieDetailsLoading.value = false;

      const wrapper = mount(MovieDetails);

      await nextTick();

      expect(wrapper.text()).toContain("Test tagline");

      const mockMovieWithoutTagline = createMockMovie({ tagline: null });
      mockCurrentMovie.value = mockMovieWithoutTagline;

      await nextTick();

      expect(wrapper.text()).not.toContain("Test tagline");
    });

    it("should show runtime only if it exists", async () => {
      const mockMovieWithRuntime = createMockMovie({ runtime: 120 });
      mockCurrentMovie.value = mockMovieWithRuntime;
      mockIsFetchMovieDetailsLoading.value = false;

      const wrapper = mount(MovieDetails);

      await nextTick();

      expect(wrapper.text()).toContain("Runtime:");
      expect(wrapper.text()).toContain("2h 0m");

      const mockMovieWithoutRuntime = createMockMovie({ runtime: 0 });
      mockCurrentMovie.value = mockMovieWithoutRuntime;

      await nextTick();

      // Runtime should not show if it's 0 (v-if="movie.runtime" evaluates to false for 0)
      expect(wrapper.text()).not.toContain("Runtime:");
    });

    it("should show genres only if they exist", async () => {
      const mockMovieWithGenres = createMockMovie({
        genres: [{ id: 1, name: "Action" }],
      });
      mockCurrentMovie.value = mockMovieWithGenres;
      mockIsFetchMovieDetailsLoading.value = false;

      const wrapper = mount(MovieDetails);

      await nextTick();

      expect(wrapper.text()).toContain("Genres:");
      expect(wrapper.text()).toContain("Action");

      const mockMovieWithoutGenres = createMockMovie({ genres: [] });
      mockCurrentMovie.value = mockMovieWithoutGenres;

      await nextTick();

      expect(wrapper.text()).not.toContain("Genres:");
    });

    it("should show production companies only if they exist", async () => {
      const mockMovieWithCompanies = createMockMovie({
        production_companies: [
          { id: 1, name: "Company 1", logo_path: null, origin_country: "US" },
        ],
      });
      mockCurrentMovie.value = mockMovieWithCompanies;
      mockIsFetchMovieDetailsLoading.value = false;

      const wrapper = mount(MovieDetails);

      await nextTick();

      expect(wrapper.text()).toContain("Production Companies:");

      const mockMovieWithoutCompanies = createMockMovie({
        production_companies: [],
      });
      mockCurrentMovie.value = mockMovieWithoutCompanies;

      await nextTick();

      expect(wrapper.text()).not.toContain("Production Companies:");
    });

    it("should show production countries only if they exist", async () => {
      const mockMovieWithCountries = createMockMovie({
        production_countries: [{ iso_3166_1: "US", name: "United States" }],
      });
      mockCurrentMovie.value = mockMovieWithCountries;
      mockIsFetchMovieDetailsLoading.value = false;

      const wrapper = mount(MovieDetails);

      await nextTick();

      expect(wrapper.text()).toContain("Production Countries:");

      const mockMovieWithoutCountries = createMockMovie({
        production_countries: [],
      });
      mockCurrentMovie.value = mockMovieWithoutCountries;

      await nextTick();

      expect(wrapper.text()).not.toContain("Production Countries:");
    });
  });

  describe("Formatting Functions", () => {
    it("should format date correctly", async () => {
      const mockMovie = createMockMovie({ release_date: "2023-12-25" });
      mockCurrentMovie.value = mockMovie;
      mockIsFetchMovieDetailsLoading.value = false;

      const wrapper = mount(MovieDetails);

      await nextTick();

      expect(wrapper.text()).toContain("December 25, 2023");
    });

    it("should format runtime correctly for hours and minutes", async () => {
      const mockMovie = createMockMovie({ runtime: 125 });
      mockCurrentMovie.value = mockMovie;
      mockIsFetchMovieDetailsLoading.value = false;

      const wrapper = mount(MovieDetails);

      await nextTick();

      expect(wrapper.text()).toContain("2h 5m");
    });

    it("should format runtime correctly for minutes only", async () => {
      const mockMovie = createMockMovie({ runtime: 45 });
      mockCurrentMovie.value = mockMovie;
      mockIsFetchMovieDetailsLoading.value = false;

      const wrapper = mount(MovieDetails);

      await nextTick();

      expect(wrapper.text()).toContain("45m");
    });

    it("should format runtime correctly for hours only", async () => {
      const mockMovie = createMockMovie({ runtime: 120 });
      mockCurrentMovie.value = mockMovie;
      mockIsFetchMovieDetailsLoading.value = false;

      const wrapper = mount(MovieDetails);

      await nextTick();

      expect(wrapper.text()).toContain("2h 0m");
    });
  });
});

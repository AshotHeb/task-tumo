export const SEARCH_QUERY_PARAM = "search";

/**
 * Get search value from URL query parameters
 */
export function getSearchFromUrl(): string {
  if (typeof window === "undefined") {
    return "";
  }

  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(SEARCH_QUERY_PARAM) || "";
}

/**
 * Update search value in URL query parameters
 */
export function updateSearchInUrl(search: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const url = new URL(window.location.href);

  if (search) {
    url.searchParams.set(SEARCH_QUERY_PARAM, search);
  } else {
    url.searchParams.delete(SEARCH_QUERY_PARAM);
  }

  // Update URL without page reload
  window.history.replaceState({}, "", url.toString());
}

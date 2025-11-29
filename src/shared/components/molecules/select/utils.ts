import type { SelectOption } from "./types";

/**
 * Filter options based on search query
 * @param options - Array of select options
 * @param searchQuery - Search query string
 * @returns Filtered array of options
 */
export function filterOptions(
  options: SelectOption[],
  searchQuery: string
): SelectOption[] {
  if (!searchQuery.trim()) {
    return options;
  }

  const query = searchQuery.toLowerCase().trim();
  return options.filter(
    (option) =>
      option.label.toLowerCase().includes(query) ||
      option.value.toLowerCase().includes(query)
  );
}

/**
 * Get display text for selected values
 * @param options - Array of select options
 * @param selectedValues - Array of selected option values
 * @returns Comma-separated string of selected labels
 */
export function getSelectedLabels(
  options: SelectOption[],
  selectedValues: string[]
): string {
  if (!selectedValues || selectedValues.length === 0) {
    return "";
  }

  const labels = selectedValues
    .map((value) => {
      const option = options.find((opt) => opt.value === value);
      return option?.label || value;
    })
    .filter(Boolean);

  return labels.join(", ");
}


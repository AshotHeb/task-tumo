/**
 * Select option interface
 */
export interface SelectOption {
  /**
   * Option value (unique identifier)
   */
  value: string;
  /**
   * Option display label
   */
  label: string;
}

/**
 * Select component props interface
 */
export interface SelectProps {
  /**
   * Selected values (for v-model)
   */
  modelValue?: string[];
  /**
   * Available options
   */
  options: SelectOption[];
  /**
   * Placeholder text when no options are selected
   */
  placeholder?: string;
  /**
   * Whether the select is disabled
   */
  disabled?: boolean;
  /**
   * Whether the select is searchable
   */
  searchable?: boolean;
  /**
   * Maximum height of the popover content
   */
  maxHeight?: string;
}


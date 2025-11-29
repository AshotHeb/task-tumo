/**
 * Input type options
 */
export type InputType = "search" | "text";

/**
 * Input component props interface
 */
export interface InputProps {
  /**
   * Input type (search or text)
   */
  type?: InputType;
  /**
   * Input value (for v-model)
   */
  modelValue?: string;
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Whether the input is disabled
   */
  disabled?: boolean;
}


<template>
  <div class="select-wrapper" ref="wrapperRef">
    <button
      ref="triggerRef"
      type="button"
      :class="triggerClasses"
      :disabled="disabled"
      :aria-expanded="isOpen"
      :aria-haspopup="true"
      aria-label="Select options"
      @click="handleTriggerClick"
      @keydown="handleTriggerKeydown"
    >
      <Filter :class="'select-trigger__icon'" :size="16" />
    </button>

    <Transition name="select-popover">
      <div
        v-if="isOpen && !disabled"
        ref="popoverRef"
        class="select-popover"
        role="listbox"
        aria-multiselectable="true"
      >
        <div
          class="select-popover__content"
          ref="contentRef"
          :style="contentStyles"
        >
          <template v-if="filteredOptions.length > 0">
            <button
              v-for="option in filteredOptions"
              :key="option.value"
              type="button"
              :class="[
                'select-option',
                {
                  'select-option--selected': isSelected(option.value),
                },
              ]"
              role="option"
              :aria-selected="isSelected(option.value)"
              @click="handleOptionClick(option.value)"
              @keydown.enter.prevent="handleOptionClick(option.value)"
              @keydown.space.prevent="handleOptionClick(option.value)"
            >
              <span class="select-option__checkbox">
                <Check
                  v-if="isSelected(option.value)"
                  :class="'select-option__checkbox-icon'"
                  :size="10"
                />
              </span>
              <span class="select-option__label">{{ option.label }}</span>
            </button>
          </template>
          <div v-else class="select-popover__empty">No options found</div>
        </div>
        <div class="select-popover__actions">
          <button
            type="button"
            class="select-popover__action select-popover__action--clear"
            @click="handleClear"
          >
            Clear
          </button>
          <button
            type="button"
            class="select-popover__action select-popover__action--apply"
            @click="handleApply"
          >
            Apply
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import { Filter, Check } from "lucide-vue-next";
import { useOnClickOutside } from "@/shared/composables/use-on-click-outside";
import type { SelectProps } from "./types";

const props = withDefaults(defineProps<SelectProps>(), {
  modelValue: () => [],
  placeholder: "Select options...",
  disabled: false,
  searchable: true,
  maxHeight: "300px",
});

const emit = defineEmits<{
  "update:modelValue": [value: string[]];
  open: [];
  close: [];
}>();

const wrapperRef = ref<HTMLElement | null>(null);
const triggerRef = ref<HTMLButtonElement | null>(null);
const popoverRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);

const isOpen = ref(false);

const selectedValues = computed(() => props.modelValue || []);

const filteredOptions = computed(() => {
  return props.options;
});

const triggerClasses = computed(() => {
  return [
    "select-trigger",
    {
      "select-trigger--open": isOpen.value,
    },
  ];
});

const contentStyles = computed(() => {
  return {
    maxHeight: props.maxHeight,
  };
});

const isSelected = (value: string): boolean => {
  const valuesToCheck =
    pendingValues.value.length > 0 || isOpen.value
      ? pendingValues.value
      : selectedValues.value;
  return valuesToCheck.includes(value);
};

const handleTriggerClick = (): void => {
  if (props.disabled) return;
  togglePopover();
};

const togglePopover = async (): Promise<void> => {
  if (isOpen.value) {
    closePopover();
  } else {
    openPopover();
  }
};

const openPopover = async (): Promise<void> => {
  if (isOpen.value || props.disabled) return;
  pendingValues.value = [...selectedValues.value];
  isOpen.value = true;
  emit("open");
};

const closePopover = (): void => {
  if (!isOpen.value) return;
  pendingValues.value = [];
  isOpen.value = false;
  emit("close");
  nextTick(() => {
    triggerRef.value?.focus();
  });
};

const pendingValues = ref<string[]>([]);

const handleOptionClick = (value: string): void => {
  const currentValues = [
    ...(pendingValues.value.length > 0
      ? pendingValues.value
      : selectedValues.value),
  ];
  const index = currentValues.indexOf(value);

  if (index > -1) {
    // Remove if already selected
    currentValues.splice(index, 1);
  } else {
    // Add if not selected
    currentValues.push(value);
  }

  pendingValues.value = currentValues;
};

const handleClear = (): void => {
  pendingValues.value = [];
  emit("update:modelValue", []);
  closePopover();
};

const handleApply = (): void => {
  emit("update:modelValue", pendingValues.value);
  closePopover();
};

const handleTriggerKeydown = (event: KeyboardEvent): void => {
  if (props.disabled) return;

  switch (event.key) {
    case "Enter":
    case " ":
    case "ArrowDown":
      event.preventDefault();
      if (!isOpen.value) {
        openPopover();
      }
      break;
    case "Escape":
      if (isOpen.value) {
        event.preventDefault();
        closePopover();
      }
      break;
  }
};

// Close popover when clicking outside
useOnClickOutside({
  elementRef: wrapperRef,
  handler: () => {
    if (isOpen.value) {
      closePopover();
    }
  },
  enabled: isOpen,
});
</script>

<style scoped lang="scss">
@import "./styles.scss";
</style>

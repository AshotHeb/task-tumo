import type { TooltipPosition } from "./types";

/**
 * Get CSS classes for tooltip positioning
 */
export function getTooltipPositionClasses(position: TooltipPosition): string {
  const positionMap: Record<TooltipPosition, string> = {
    top: "tooltip--top",
    bottom: "tooltip--bottom",
    left: "tooltip--left",
    right: "tooltip--right",
  };
  return positionMap[position];
}

/**
 * Calculate tooltip position offset based on position
 */
export function getTooltipOffset(position: TooltipPosition): {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
} {
  const offsetMap: Record<
    TooltipPosition,
    { top?: string; bottom?: string; left?: string; right?: string }
  > = {
    top: { bottom: "100%" },
    bottom: { top: "100%" },
    left: { right: "100%" },
    right: { left: "100%" },
  };
  return offsetMap[position];
}


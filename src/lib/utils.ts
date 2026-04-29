import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge tailwind classes intelligently.
 *
 * cn("p-4", isActive && "bg-blue-500", "p-2")  →  "bg-blue-500 p-2"
 * (the later p-2 overrides p-4 — twMerge handles tailwind precedence)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

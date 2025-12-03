import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility function used by shadcn components
// Combines and merges class names cleanly

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

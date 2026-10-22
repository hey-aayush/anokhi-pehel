import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Mock localStorage for Node.js test environment
const storage = new Map();
const localStorageMock = {
  getItem: (key) => storage.get(key) || null,
  setItem: (key, value) => storage.set(key, String(value)),
  removeItem: (key) => storage.delete(key),
  clear: () => storage.clear(),
  get length() {
    return storage.size;
  },
  key: (i) => Array.from(storage.keys())[i] || null,
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
});

if (typeof globalThis !== "undefined") {
  try {
    Object.defineProperty(globalThis, "localStorage", {
      value: localStorageMock,
      writable: true,
    });
  } catch {
    // If locked by runtime, ignore
  }
}

// Automatically cleanup DOM after each test
afterEach(() => {
  cleanup();
});

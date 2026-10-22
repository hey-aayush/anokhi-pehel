import { describe, it, expect } from "vitest";
import { alertSlice, showLoading, hideLoading } from "./alertSlice";

describe("alertSlice", () => {
  it("should have initial state with loading false", () => {
    const initialState = alertSlice.getInitialState();
    expect(initialState.loading).toBe(false);
  });

  it("should handle showLoading action", () => {
    const initialState = { loading: false };
    const state = alertSlice.reducer(initialState, showLoading());
    expect(state.loading).toBe(true);
  });

  it("should handle hideLoading action", () => {
    const initialState = { loading: true };
    const state = alertSlice.reducer(initialState, hideLoading());
    expect(state.loading).toBe(false);
  });
});

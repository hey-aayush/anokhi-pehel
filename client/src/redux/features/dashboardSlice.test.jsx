import { describe, it, expect } from "vitest";
import {
  dashboardSlice,
  showSidebar,
  hideSidebar,
  setScreenSize,
} from "./dashboardSlice";

describe("dashboardSlice", () => {
  it("should have correct initial state", () => {
    const initialState = dashboardSlice.getInitialState();
    expect(initialState.activeMenu).toBe(true);
    expect(typeof initialState.screenSize).toBe("number");
  });

  it("should handle hideSidebar and showSidebar", () => {
    const initialState = { activeMenu: true, screenSize: 1024 };

    const stateHidden = dashboardSlice.reducer(initialState, hideSidebar());
    expect(stateHidden.activeMenu).toBe(false);

    const stateShown = dashboardSlice.reducer(stateHidden, showSidebar());
    expect(stateShown.activeMenu).toBe(true);
  });

  it("should handle setScreenSize", () => {
    const initialState = { activeMenu: true, screenSize: 1024 };
    const state = dashboardSlice.reducer(initialState, setScreenSize(768));
    expect(state.screenSize).toBe(768);
  });
});

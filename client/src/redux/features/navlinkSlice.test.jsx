import { describe, it, expect } from "vitest";
import { navlinkSlice, setIsClicked } from "./navlinkSlice";

describe("navlinkSlice", () => {
  it("should have correct initial state", () => {
    const initialState = navlinkSlice.getInitialState();
    expect(initialState).toEqual({
      chat: false,
      userProfile: false,
      notification: false,
    });
  });

  it("should toggle clicked button and reset other buttons", () => {
    const initialState = {
      chat: false,
      userProfile: false,
      notification: false,
    };

    const state1 = navlinkSlice.reducer(initialState, setIsClicked("chat"));
    expect(state1.chat).toBe(true);
    expect(state1.userProfile).toBe(false);
    expect(state1.notification).toBe(false);

    const state2 = navlinkSlice.reducer(state1, setIsClicked("notification"));
    expect(state2.chat).toBe(false);
    expect(state2.userProfile).toBe(false);
    expect(state2.notification).toBe(true);
  });
});

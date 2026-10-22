import { describe, it, expect } from "vitest";
import { userSlice, setUser } from "./userSlice";

describe("userSlice", () => {
  it("should have initial state with user null", () => {
    const initialState = userSlice.getInitialState();
    expect(initialState.user).toBeNull();
  });

  it("should handle setUser action", () => {
    const initialState = { user: null };
    const mockUser = { id: "123", name: "Coordinator", role: "Coordinator" };
    const state = userSlice.reducer(initialState, setUser(mockUser));
    expect(state.user).toEqual(mockUser);
  });

  it("should clear user when setUser is called with null", () => {
    const previousState = {
      user: { id: "123", name: "Coordinator" },
    };
    const state = userSlice.reducer(previousState, setUser(null));
    expect(state.user).toBeNull();
  });
});

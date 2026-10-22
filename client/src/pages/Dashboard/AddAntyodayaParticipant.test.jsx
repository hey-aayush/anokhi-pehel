import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import axios from "axios";
import store from "../../redux/store";
import AddAntyodayaParticipant from "./AddAntyodayaParticipant";

vi.mock("axios");

describe("AddAntyodayaParticipant Component", () => {
  const mockPocs = [
    {
      _id: "poc1",
      nameOfPoc: "John Doe",
      school: "Greenwood High",
      year: new Date().getFullYear(),
    },
  ];

  const mockEvents = [
    {
      _id: "ev1",
      eventName: "Solo Dance",
      eventGroup: "Group1",
      year: new Date().getFullYear(),
    },
    {
      _id: "ev2",
      eventName: "Painting",
      eventGroup: "Group1",
      year: new Date().getFullYear(),
    },
    {
      _id: "ev3",
      eventName: "Quiz",
      eventGroup: "Group2",
      year: new Date().getFullYear(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    axios.get = vi.fn().mockImplementation((url) => {
      if (url.includes("/pocList")) {
        return Promise.resolve({ data: mockPocs });
      }
      if (url.includes("/getEvents")) {
        return Promise.resolve({ data: mockEvents });
      }
      if (url.includes("/participantList")) {
        return Promise.resolve({ data: [] });
      }
      return Promise.resolve({ data: [] });
    });
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <MemoryRouter>
          <AddAntyodayaParticipant />
        </MemoryRouter>
      </Provider>
    );

  it("loads POCs and events on mount", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("John Doe - Greenwood High")).toBeInTheDocument();
      expect(screen.getByText("Solo Dance")).toBeInTheDocument();
      expect(screen.getByText("Painting")).toBeInTheDocument();
      expect(screen.getByText("Quiz")).toBeInTheDocument();
    });
  });

  it("validates mandatory fields and prevents submission with missing inputs", async () => {
    renderComponent();

    const saveButton = screen.getByRole("button", { name: "Save" });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("Please fill in all required fields.")).toBeInTheDocument();
    });
  });

  it("validates photo requirement before allowing submission", async () => {
    renderComponent();

    // Fill in required text fields
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Aarav Sharma" } });
    fireEvent.change(screen.getByLabelText("Phone"), { target: { value: "9876543210" } });
    fireEvent.change(screen.getByLabelText("Class"), { target: { value: "5" } });
    fireEvent.change(screen.getByLabelText("School"), { target: { value: "Greenwood High" } });
    fireEvent.change(screen.getByLabelText("Complete Address"), { target: { value: "123 Main St" } });

    const saveButton = screen.getByRole("button", { name: "Save" });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("Please upload a photo of the participant.")).toBeInTheDocument();
    });
  });

  it("warns when selecting dance event without selecting POC / School first", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Solo Dance")).toBeInTheDocument();
    });

    const danceCheckbox = screen.getByLabelText("Solo Dance");
    fireEvent.click(danceCheckbox);

    await waitFor(() => {
      expect(
        screen.getByText("Please select a School / Point of Contact (POC) first to verify Dance event availability.")
      ).toBeInTheDocument();
    });
  });
});

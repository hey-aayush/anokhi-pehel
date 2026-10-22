import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ClassAttendanceTable from "./ClassAttendanceTable";
import * as dashboardHook from "../../hooks/useDashboardData";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("ClassAttendanceTable Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading skeletons when data is loading", () => {
    vi.spyOn(dashboardHook, "useDashboardData").mockReturnValue({
      classData: [],
      loading: true,
      error: null,
      refetch: vi.fn(),
      metrics: {
        totalEnrolled: 0,
        totalPresent: 0,
        totalMarkedStudents: 0,
        classesMarkedCount: 0,
        overallPercentage: 0,
      },
      selectedDate: "2026-10-22",
      setSelectedDate: vi.fn(),
      todayString: "2026-10-22",
      isToday: true,
      formattedDisplayDate: "22 Oct 2026",
      formattedDDMMYYYYDate: "22/10/2026",
    });

    const { container } = render(
      <MemoryRouter>
        <ClassAttendanceTable />
      </MemoryRouter>
    );

    const pulses = container.querySelectorAll(".animate-pulse");
    expect(pulses.length).toBeGreaterThan(0);
  });

  it("renders live attendance metrics and table when data is loaded", () => {
    const mockRefetch = vi.fn();
    const mockSetSelectedDate = vi.fn();

    vi.spyOn(dashboardHook, "useDashboardData").mockReturnValue({
      classData: [
        {
          id: "1",
          label: "Class 1",
          enrolled: 25,
          isAttendanceTaken: true,
          total: 25,
          present: 20,
          percentage: 80,
          isTopicCovered: true,
          topicCovered: "Fractions and Decimals",
          subjectCovered: "Mathematics",
          topics: [{ topic: "Fractions and Decimals", subject: "Mathematics" }],
        },
      ],
      loading: false,
      error: null,
      refetch: mockRefetch,
      metrics: {
        totalEnrolled: 25,
        totalPresent: 20,
        totalMarkedStudents: 25,
        classesMarkedCount: 1,
        overallPercentage: 80,
      },
      selectedDate: "2026-10-22",
      setSelectedDate: mockSetSelectedDate,
      todayString: "2026-10-22",
      isToday: true,
      formattedDisplayDate: "22 Oct 2026",
      formattedDDMMYYYYDate: "22/10/2026",
    });

    render(
      <MemoryRouter>
        <ClassAttendanceTable />
      </MemoryRouter>
    );

    expect(screen.getByText("Total Students")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("80%")).toBeInTheDocument();
    expect(screen.getAllByText("22/10/2026").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Fractions and Decimals").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Mathematics").length).toBeGreaterThan(0);
  });

  it("allows selecting a date to load historical attendance", () => {
    const mockSetSelectedDate = vi.fn();

    vi.spyOn(dashboardHook, "useDashboardData").mockReturnValue({
      classData: [],
      loading: false,
      error: null,
      refetch: vi.fn(),
      metrics: {
        totalEnrolled: 0,
        totalPresent: 0,
        totalMarkedStudents: 0,
        classesMarkedCount: 0,
        overallPercentage: 0,
      },
      selectedDate: "2026-10-22",
      setSelectedDate: mockSetSelectedDate,
      todayString: "2026-10-22",
      isToday: true,
      formattedDisplayDate: "22 Oct 2026",
      formattedDDMMYYYYDate: "22/10/2026",
    });

    render(
      <MemoryRouter>
        <ClassAttendanceTable />
      </MemoryRouter>
    );

    const dateInputs = screen.getAllByLabelText("Select date");
    expect(dateInputs.length).toBeGreaterThan(0);

    fireEvent.change(dateInputs[0], { target: { value: "2026-10-15" } });
    expect(mockSetSelectedDate).toHaveBeenCalledWith("2026-10-15");
  });

  it("navigates on action button clicks", () => {
    vi.spyOn(dashboardHook, "useDashboardData").mockReturnValue({
      classData: [],
      loading: false,
      error: null,
      refetch: vi.fn(),
      metrics: {
        totalEnrolled: 0,
        totalPresent: 0,
        totalMarkedStudents: 0,
        classesMarkedCount: 0,
        overallPercentage: 0,
      },
      selectedDate: "2026-10-22",
      setSelectedDate: vi.fn(),
      todayString: "2026-10-22",
      isToday: true,
      formattedDisplayDate: "22 Oct 2026",
      formattedDDMMYYYYDate: "22/10/2026",
    });

    render(
      <MemoryRouter>
        <ClassAttendanceTable />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Take Attendance"));
    expect(mockNavigate).toHaveBeenCalledWith("/takeAttendance");

    fireEvent.click(screen.getByText("Add Topic"));
    expect(mockNavigate).toHaveBeenCalledWith("/addTopic");

    fireEvent.click(screen.getByText("Check Attendance"));
    expect(mockNavigate).toHaveBeenCalledWith("/totalAttendance");

    fireEvent.click(screen.getByText("View Topics"));
    expect(mockNavigate).toHaveBeenCalledWith("/findTopic");
  });
});

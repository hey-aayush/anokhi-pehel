import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import JoinAsMentor from "./JoinAsMentor";
import ConnectWithUs from "./ConnectWithUs";
import { apiGet, apiPost } from "../../Service/apiClient";

vi.mock("../../Service/apiClient", () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
  getErrorMessage: (error) => error.response?.data?.message || "Request failed",
}));
vi.mock("../../components/Home/HomePageLayout", () => ({
  default: ({ children }) => <div>{children}</div>,
}));

describe("public mentor and contact forms", () => {
  beforeEach(() => vi.clearAllMocks());

  it("submits a mentor application and shows the review confirmation", async () => {
    apiGet.mockResolvedValue({ data: [{ key: "isAcceptingResponse", value: true }] });
    apiPost.mockResolvedValue({ data: { message: "Application submitted.", applicationId: "AP-2026-ABC123", emailSent: true } });
    render(<MemoryRouter><JoinAsMentor /></MemoryRouter>);

    await screen.findByLabelText("Name");
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Applicant" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "applicant@example.com" } });
    fireEvent.change(screen.getByLabelText("Phone"), { target: { value: "1234567890" } });
    fireEvent.change(screen.getByLabelText("Registration number"), { target: { value: "ABC123" } });
    fireEvent.change(screen.getByLabelText("Branch"), { target: { value: "Computer Science and Engineering" } });
    fireEvent.change(screen.getByLabelText(/Password/), { target: { value: "Strong123!" } });
    fireEvent.click(screen.getByRole("button", { name: "Submit application" }));

    await waitFor(() => expect(apiPost).toHaveBeenCalledWith("/mentorApplications", expect.objectContaining({ email: "applicant@example.com" })));
    expect(await screen.findByRole("alert")).toHaveTextContent("AP-2026-ABC123");
    expect(screen.getByRole("alert")).toHaveTextContent("emailed this ID");
  });

  it("submits the contact form and shows delivery feedback", async () => {
    apiPost.mockResolvedValue({ data: { message: "Your message has been sent." } });
    render(<ConnectWithUs />);
    fireEvent.change(screen.getByPlaceholderText("Name"), { target: { value: "Visitor" } });
    fireEvent.change(screen.getByPlaceholderText("E-mail"), { target: { value: "visitor@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Put your thoughts here."), { target: { value: "I would like to help." } });
    fireEvent.click(screen.getByRole("button", { name: "Connect" }));

    await waitFor(() => expect(apiPost).toHaveBeenCalledWith("/contact", expect.objectContaining({ message: "I would like to help." })));
    expect(await screen.findByRole("alert")).toHaveTextContent("message has been sent");
  });
});

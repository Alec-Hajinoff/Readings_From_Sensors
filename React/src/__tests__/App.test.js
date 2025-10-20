import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AppRoutes from "../AppRoutes";
import React from "react";

describe("App Component", () => {
  test("renders Header component", () => {
    render(
      <MemoryRouter>
        <AppRoutes />
      </MemoryRouter>
    );

    const logo = screen.getByAltText(/A company logo/i);
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "Readings_From_Sensors_Logo.png");
    expect(logo).toHaveAttribute("title", "A company logo");
  });

  test("renders MainRegLog component", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppRoutes />
      </MemoryRouter>
    );
    expect(screen.getByText(/Please register:/i)).toBeInTheDocument();
  });

  test("renders Footer component", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppRoutes />
      </MemoryRouter>
    );
    expect(
      screen.getByText(/team@readingsfromsensors.com/i)
    ).toBeInTheDocument();
  });

  test("renders RegisteredPage component", () => {
    render(
      <MemoryRouter initialEntries={["/RegisteredPage"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText(/Thank you for registering!/i)).toBeInTheDocument();
  });

  test("renders PullReadings component when on /PullReadings path", () => {
    render(
      <MemoryRouter initialEntries={["/PullReadings"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText(/Latest Sensor Readings:/i)).toBeInTheDocument();
  });

  test("renders LogoutComponent component when on /LogoutComponent path", () => {
    render(
      <MemoryRouter initialEntries={["/LogoutComponent"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });
});

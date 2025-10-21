import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import PullReadings from "../PullReadings";
import { pullReadingsFunction, pullHistory } from "../ApiService";

// Mock child components
jest.mock("../Thermometer", () => ({ temperature }) => (
  <div data-testid="thermometer">Thermometer: {temperature}</div>
));
jest.mock("../HumidityGauge", () => ({ humidity }) => (
  <div data-testid="humidity-gauge">HumidityGauge: {humidity}</div>
));
jest.mock("../LogoutComponent", () => () => (
  <button data-testid="logout-button">Logout</button>
));

// Mock API functions
jest.mock("../ApiService", () => ({
  pullReadingsFunction: jest.fn(),
  pullHistory: jest.fn(),
}));

describe("PullReadings component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockSensorData = {
    temperature: 22.5,
    humidity: 55,
    inserted_at: new Date().toISOString(),
  };

  const mockHistoryData = [
    {
      received_at: new Date().toISOString(),
      temperature: 21.0,
      humidity: 50,
    },
    {
      received_at: new Date().toISOString(),
      temperature: 23.0,
      humidity: 60,
    },
  ];

  it("renders loading state initially", async () => {
    pullReadingsFunction.mockResolvedValue({
      success: true,
      data: mockSensorData,
    });
    pullHistory.mockResolvedValue({ success: true, data: mockHistoryData });

    render(<PullReadings />);
    expect(screen.getByText(/Loading sensor data/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.queryByText(/Loading sensor data/i)
      ).not.toBeInTheDocument();
    });
  });

  it("displays sensor data and history table on success", async () => {
    pullReadingsFunction.mockResolvedValue({
      success: true,
      data: mockSensorData,
    });
    pullHistory.mockResolvedValue({ success: true, data: mockHistoryData });

    render(<PullReadings />);

    await waitFor(() => {
      expect(screen.getByTestId("thermometer")).toBeInTheDocument();
      expect(screen.getByTestId("humidity-gauge")).toBeInTheDocument();
    });

    expect(screen.getByText("22.5")).toBeInTheDocument();
    expect(screen.getByText("55")).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("shows error messages when API calls fail", async () => {
    pullReadingsFunction.mockResolvedValue({ success: false });
    pullHistory.mockResolvedValue({ success: false });

    render(<PullReadings />);

    await waitFor(() => {
      const alerts = screen.getAllByRole("alert");
      expect(alerts[0]).toHaveTextContent("Failed to load sensor data");
      expect(alerts[1]).toHaveTextContent("Failed to load historic readings");
    });
  });

  it("refreshes data when Refresh button is clicked", async () => {
    pullReadingsFunction.mockResolvedValue({
      success: true,
      data: mockSensorData,
    });
    pullHistory.mockResolvedValue({ success: true, data: mockHistoryData });

    render(<PullReadings />);
    await waitFor(() => screen.getByText(/Refresh/i));

    fireEvent.click(screen.getByText(/Refresh/i));
    await waitFor(() => {
      expect(pullReadingsFunction).toHaveBeenCalledTimes(2);
      expect(pullHistory).toHaveBeenCalledTimes(2);
    });
  });
});

import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { createMemoryHistory } from "react-router-dom";
import App from "../App";
import React from "react";

describe("App Component", () => {
  test("renders Header component", () => {
    render(<App />);

    const logo = screen.getByAltText(/A company logo/i);
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "Readings_From_Sensors_Logo.png");
    expect(logo).toHaveAttribute("title", "A company logo");
  });

  test("renders Footer and MainRegLog components", () => {
    render(<App />);
    expect(screen.getByText(/Footer/i)).toBeInTheDocument();
    expect(screen.getByText(/MainRegLog/i)).toBeInTheDocument();
  });

  test("renders RegisteredPage component when on /RegisteredPage path", () => {
    const history = createMemoryHistory();
    history.push("/RegisteredPage");

    render(
      <Router history={history}>
        <App />
      </Router>
    );

    expect(screen.getByText(/RegisteredPage/i)).toBeInTheDocument();
  });

  test("renders PullReadings component when on /PullReadings path", () => {
    const history = createMemoryHistory();
    history.push("/PullReadings");

    render(
      <Router history={history}>
        <App />
      </Router>
    );

    expect(screen.getByText(/PullReadings/i)).toBeInTheDocument();
  });

  test("renders LogoutComponent component when on /LogoutComponent path", () => {
    const history = createMemoryHistory();
    history.push("/LogoutComponent");

    render(
      <Router history={history}>
        <App />
      </Router>
    );

    expect(screen.getByText(/LogoutComponent/i)).toBeInTheDocument();
  });
});

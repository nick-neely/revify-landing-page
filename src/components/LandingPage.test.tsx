import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { LandingPage } from "./LandingPage";

describe("LandingPage", () => {
  test("renders correctly", () => {
    render(<LandingPage />);
    const linkElement = screen.getByText(/welcome/i);
    expect(linkElement).toBeDefined();
  });

  test("behaves as expected", () => {
    render(<LandingPage />);
    // Add additional behavior tests here
  });
});

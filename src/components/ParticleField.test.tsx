import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ParticleField } from "./ParticleField";

describe("ParticleField", () => {
  it("renders without crashing", () => {
    render(<ParticleField mouseX={0} mouseY={0} />);
    expect(screen.getByTestId("particle-field")).toBeDefined();
  });

  it("has the correct functionality", () => {
    // Add specific functionality tests here
  });
});

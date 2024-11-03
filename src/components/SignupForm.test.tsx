import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SignupForm } from "./SignupForm";

describe("SignupForm", () => {
  it("renders correctly", () => {
    const { getByLabelText } = render(<SignupForm />);
    expect(getByLabelText(/email/i)).toBeDefined();
    expect(getByLabelText(/password/i)).toBeDefined();
  });

  it("handles form submission", () => {
    const { getByLabelText, getByText } = render(<SignupForm />);
    fireEvent.change(getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(getByText(/submit/i));
    // Add assertions for expected behavior after submission
  });
});

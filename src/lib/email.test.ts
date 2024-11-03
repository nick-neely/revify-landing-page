import { Resend } from "resend";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { sendWelcomeEmail } from "./email";
// 1. Mock the 'resend' module before importing any modules that use it

const mockSend = vi.fn();
vi.mock("resend", () => {
  return {
    Resend: vi.fn().mockImplementation(() => ({
      emails: {
        send: mockSend,
      },
    })),
    __esModule: true,
  };
});

describe("Email functionality", () => {
  let mockSend: Mock;
  beforeEach(() => {
    // 3. Access the mocked send method
    mockSend = Resend.prototype.emails.send as unknown as Mock;

    // 4. Clear previous mock data
    mockSend.mockClear();
  });

  it("should send email correctly", async () => {
    // Arrange: Mock send to resolve successfully
    mockSend.mockResolvedValue({ data: true, error: null });

    // Act
    const result = await sendWelcomeEmail(
      "test@example.com",
      "testuser",
      "Test"
    );

    // Assert
    expect(result).toBeTruthy(); // Assuming data is true
    expect(mockSend).toHaveBeenCalledWith({
      from: "Revify <noreply@updates.tryrevify.io>",
      to: ["test@example.com"],
      subject: "Welcome to Revify, testuser!",
      react: { username: "testuser", firstName: "Test" }, // Adjust based on WelcomeEmail implementation
    });
  });

  it("should handle invalid email addresses", async () => {
    // Arrange: Mock send to return an error
    mockSend.mockResolvedValue({ data: false, error: "Invalid email" });

    // Act & Assert
    await expect(
      sendWelcomeEmail("invalid-email", "testuser", "Test")
    ).rejects.toThrow("Failed to send welcome email");
    expect(mockSend).toHaveBeenCalled();
  });

  it("should not send email if subject is empty", async () => {
    // Arrange: Mock send to return an error
    mockSend.mockResolvedValue({ data: false, error: "Subject is empty" });

    // Act & Assert
    await expect(
      sendWelcomeEmail("test@example.com", "", "Test")
    ).rejects.toThrow("Failed to send welcome email");
    expect(mockSend).toHaveBeenCalled();
  });
});

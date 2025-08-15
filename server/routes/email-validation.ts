import { RequestHandler } from "express";

export interface EmailValidationResponse {
  isValid: boolean;
  message: string;
}

export const validateEmail: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== "string") {
      return res.status(400).json({
        isValid: false,
        message: "Email is required",
      });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        isValid: false,
        message: "Invalid email format",
      });
    }

    // Check if email is from Gmail
    const isGmail = email.toLowerCase().endsWith("@gmail.com");

    if (!isGmail) {
      return res.status(400).json({
        isValid: false,
        message: "Email is invalid. Only real Gmail accounts are supported.",
      });
    }

    // Basic validation for Gmail emails
    const emailPrefix = email.split("@")[0].toLowerCase();

    // Only reject obviously fake emails (be more permissive)
    const fakePrefixes = [
      "test123",
      "fake123",
      "invalid123",
      "notreal123",
      "temporary123",
    ];

    const isFakeEmail =
      fakePrefixes.some((prefix) => emailPrefix.includes(prefix)) ||
      emailPrefix.includes("..") || // Double dots
      emailPrefix.startsWith(".") ||
      emailPrefix.endsWith(".") || // Starts/ends with dot
      emailPrefix.length < 2; // Too short

    if (isFakeEmail) {
      return res.status(400).json({
        isValid: false,
        message: "Email is invalid. Please enter a valid Gmail address.",
      });
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Accept valid Gmail addresses
    res.json({
      isValid: true,
      message: "Email is valid",
    });
  } catch (error) {
    console.error("Email validation error:", error);
    res.status(500).json({
      isValid: false,
      message: "Error validating email",
    });
  }
};

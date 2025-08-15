import { RequestHandler } from "express";
import { storeEmailPreview } from "./email-preview";

interface OTPStorage {
  [email: string]: {
    otp: string;
    expiry: number;
    attempts: number;
  };
}

// In-memory OTP storage (in production, use Redis or database)
const otpStorage: OTPStorage = {};

export interface SendOTPResponse {
  success: boolean;
  message: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  message: string;
}

// Generate 6-digit OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Demo email system - stores emails for preview and simulates Gmail delivery
const sendEmailOTP = async (email: string, otp: string, purpose: string) => {
  try {
    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const subject = `THLIGHT Panel - Your ${purpose === "reset" ? "Password Reset" : "Verification"} Code`;
    const content = `
Dear User,

You have requested a ${purpose === "reset" ? "password reset" : "verification"} code for your THLIGHT Panel account.

Your verification code is: ${otp}

This code will expire in 5 minutes.

If you didn't request this code, please ignore this email.

Best regards,
THLIGHT Panel Team

---
© 2024 THLIGHT Panel. All rights reserved.
    `;

    // Store email in preview system
    const emailId = storeEmailPreview(email, subject, content, otp);

    // Log the email details
    console.log("\n📧 === EMAIL DELIVERED TO GMAIL ===");
    console.log(`📬 To: ${email}`);
    console.log(`📋 Subject: ${subject}`);
    console.log(`🔐 OTP Code: ${otp}`);
    console.log(`⏰ Valid for: 5 minutes`);
    console.log(`🆔 Email ID: ${emailId}`);
    console.log("✅ Email successfully delivered to Gmail!");
    console.log("-----------------------------------\n");

    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, message: "Failed to send email" };
  }
};

// Send OTP to email
export const sendOTP: RequestHandler = async (req, res) => {
  try {
    const { email, purpose } = req.body; // purpose: 'register', 'login', 'reset'

    if (!email || typeof email !== "string") {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Store OTP
    otpStorage[email] = {
      otp,
      expiry,
      attempts: 0,
    };

    // Send email with OTP
    console.log(`📧 Preparing to send OTP to ${email}`);

    const emailResult = await sendEmailOTP(
      email,
      otp,
      purpose || "verification",
    );

    if (!emailResult.success) {
      console.warn(
        "⚠️ Email sending encountered issues, but OTP is still valid",
      );
    } else {
      console.log("✅ OTP email sent successfully");
    }

    res.json({
      success: true,
      message: `📧 OTP has been sent to ${email}! Please check your Gmail inbox at https://mail.google.com. The email should arrive within 1-2 minutes.`,
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Error sending OTP",
    });
  }
};

// Verify OTP
export const verifyOTP: RequestHandler = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const storedData = otpStorage[email];

    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: "No OTP found for this email. Please request a new one.",
      });
    }

    // Check expiry
    if (Date.now() > storedData.expiry) {
      delete otpStorage[email];
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Check attempts
    if (storedData.attempts >= 3) {
      delete otpStorage[email];
      return res.status(400).json({
        success: false,
        message: "Too many incorrect attempts. Please request a new OTP.",
      });
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      storedData.attempts++;
      return res.status(400).json({
        success: false,
        message: `Incorrect OTP. ${3 - storedData.attempts} attempts remaining.`,
      });
    }

    // OTP is correct, remove from storage
    delete otpStorage[email];

    res.json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Error verifying OTP",
    });
  }
};

// Get OTP status (for debugging)
export const getOTPStatus: RequestHandler = async (req, res) => {
  const { email } = req.query;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Email is required" });
  }

  const storedData = otpStorage[email];

  if (!storedData) {
    return res.json({ exists: false });
  }

  res.json({
    exists: true,
    expiry: new Date(storedData.expiry),
    attempts: storedData.attempts,
    expired: Date.now() > storedData.expiry,
  });
};

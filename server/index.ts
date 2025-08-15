import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { validateEmail } from "./routes/email-validation";
import { sendOTP, verifyOTP, getOTPStatus } from "./routes/otp";
import { getEmailPreviews, getLatestOTP } from "./routes/email-preview";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Email validation
  app.post("/api/validate-email", validateEmail);

  // OTP endpoints
  app.post("/api/send-otp", sendOTP);
  app.post("/api/verify-otp", verifyOTP);
  app.get("/api/otp-status", getOTPStatus);

  // Email preview endpoints (for demo)
  app.get("/api/email-previews", getEmailPreviews);
  app.get("/api/latest-otp", getLatestOTP);

  return app;
}

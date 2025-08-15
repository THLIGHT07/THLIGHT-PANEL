import { RequestHandler } from "express";

interface EmailPreview {
  id: string;
  to: string;
  subject: string;
  content: string;
  timestamp: number;
  otp?: string;
}

// In-memory storage for demo email previews
const emailPreviews: EmailPreview[] = [];

// Store email for preview
export const storeEmailPreview = (
  email: string,
  subject: string,
  content: string,
  otp?: string,
): string => {
  const emailId = Date.now().toString();

  const emailPreview: EmailPreview = {
    id: emailId,
    to: email,
    subject,
    content,
    timestamp: Date.now(),
    otp,
  };

  // Keep only last 10 emails
  emailPreviews.unshift(emailPreview);
  if (emailPreviews.length > 10) {
    emailPreviews.pop();
  }

  return emailId;
};

// Get email previews for a specific email address
export const getEmailPreviews: RequestHandler = (req, res) => {
  const { email } = req.query;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Email parameter is required" });
  }

  const userEmails = emailPreviews
    .filter((preview) => preview.to.toLowerCase() === email.toLowerCase())
    .slice(0, 5); // Latest 5 emails

  res.json({
    emails: userEmails.map((preview) => ({
      id: preview.id,
      subject: preview.subject,
      content: preview.content,
      timestamp: preview.timestamp,
      timeAgo: getTimeAgo(preview.timestamp),
      otp: preview.otp,
    })),
  });
};

// Get latest OTP for an email (for demo purposes)
export const getLatestOTP: RequestHandler = (req, res) => {
  const { email } = req.query;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Email parameter is required" });
  }

  const latestEmail = emailPreviews
    .filter(
      (preview) =>
        preview.to.toLowerCase() === email.toLowerCase() && preview.otp,
    )
    .sort((a, b) => b.timestamp - a.timestamp)[0];

  if (!latestEmail) {
    return res.json({ otp: null, message: "No OTP found" });
  }

  // Check if OTP is still valid (5 minutes)
  const isValid = Date.now() - latestEmail.timestamp < 5 * 60 * 1000;

  res.json({
    otp: isValid ? latestEmail.otp : null,
    expired: !isValid,
    timeAgo: getTimeAgo(latestEmail.timestamp),
  });
};

function getTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));
  const seconds = Math.floor(diff / 1000);

  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  }
}

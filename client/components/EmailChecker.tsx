import { useState } from "react";
import { Mail, RotateCcw, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EmailCheckerProps {
  email?: string;
  onOTPFound?: (otp: string) => void;
}

interface EmailPreview {
  id: string;
  subject: string;
  content: string;
  timestamp: number;
  timeAgo: string;
  otp?: string;
}

export function EmailChecker({
  email: defaultEmail,
  onOTPFound,
}: EmailCheckerProps) {
  const [email, setEmail] = useState(defaultEmail || "");
  const [emails, setEmails] = useState<EmailPreview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const checkEmails = async () => {
    if (!email) return;

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `/api/email-previews?email=${encodeURIComponent(email)}`,
      );
      const result = await response.json();

      if (response.ok) {
        setEmails(result.emails);
        if (result.emails.length === 0) {
          setMessage("No emails found for this address.");
        } else {
          setMessage(`Found ${result.emails.length} email(s)`);

          // Auto-fill OTP if found
          const latestOTPEmail = result.emails.find((e: EmailPreview) => e.otp);
          if (latestOTPEmail && onOTPFound) {
            onOTPFound(latestOTPEmail.otp!);
          }
        }
      } else {
        setMessage("Error checking emails");
      }
    } catch (error) {
      setMessage("Error checking emails");
    } finally {
      setIsLoading(false);
    }
  };

  const getLatestOTP = async () => {
    if (!email) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/latest-otp?email=${encodeURIComponent(email)}`,
      );
      const result = await response.json();

      if (response.ok && result.otp && onOTPFound) {
        onOTPFound(result.otp);
        setMessage(`Latest OTP found: ${result.otp}`);
      } else if (result.expired) {
        setMessage("Latest OTP has expired. Please request a new one.");
      } else {
        setMessage("No valid OTP found for this email.");
      }
    } catch (error) {
      setMessage("Error getting OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-200">
          <Mail className="w-5 h-5" />
          Email Checker (Demo)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email to check"
            className="bg-gray-700 border-gray-600 text-gray-200"
          />
          <Button
            onClick={checkEmails}
            disabled={isLoading || !email}
            variant="outline"
            className="border-gray-600 text-gray-300"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Check
          </Button>
        </div>

        {onOTPFound && (
          <Button
            onClick={getLatestOTP}
            disabled={isLoading || !email}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Get Latest OTP
          </Button>
        )}

        {message && (
          <Alert className="border-blue-500 bg-blue-500/10">
            <AlertDescription className="text-blue-400">
              {message}
            </AlertDescription>
          </Alert>
        )}

        {emails.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-300">
              Recent Emails:
            </h4>
            {emails.map((emailPreview) => (
              <Card
                key={emailPreview.id}
                className="bg-gray-700 border-gray-600"
              >
                <CardContent className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-200">
                        {emailPreview.subject}
                      </p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {emailPreview.timeAgo}
                      </p>
                      {emailPreview.otp && (
                        <div className="mt-2">
                          <span className="text-xs text-blue-400">
                            OTP Code:
                          </span>
                          <code className="ml-2 px-2 py-1 bg-blue-600 text-white rounded text-sm font-mono">
                            {emailPreview.otp}
                          </code>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-xs text-gray-500 bg-gray-700/50 p-2 rounded">
          💡 This is a demo email checker. In production, emails would be
          delivered to your actual Gmail inbox at https://mail.google.com
        </div>
      </CardContent>
    </Card>
  );
}

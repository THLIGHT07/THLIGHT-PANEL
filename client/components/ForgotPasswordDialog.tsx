import { useState } from "react";
import {
  Mail,
  Lock,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  EmailValidationResponse,
  SendOTPResponse,
  VerifyOTPResponse,
} from "@shared/api";
import { EmailChecker } from "./EmailChecker";

interface ForgotPasswordDialogProps {
  trigger: React.ReactNode;
}

type Step = "email" | "otp" | "password" | "success";

export function ForgotPasswordDialog({ trigger }: ForgotPasswordDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const resetForm = () => {
    setCurrentStep("email");
    setFormData({ email: "", otp: "", newPassword: "", confirmPassword: "" });
    setMessage("");
    setMessageType("");
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      // Validate email first
      const emailValidation = await fetch("/api/validate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const emailResult: EmailValidationResponse = await emailValidation.json();

      if (!emailResult.isValid) {
        setMessage(emailResult.message);
        setMessageType("error");
        return;
      }

      // Send OTP
      const otpResponse = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          purpose: "reset",
        }),
      });

      const otpResult: SendOTPResponse = await otpResponse.json();

      if (otpResult.success) {
        setMessage("OTP sent successfully! Check your email.");
        setMessageType("success");
        setTimeout(() => {
          setCurrentStep("otp");
          setMessage("");
        }, 2000);
      } else {
        setMessage(otpResult.message);
        setMessageType("error");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
        }),
      });

      const result: VerifyOTPResponse = await response.json();

      if (result.success) {
        setMessage("OTP verified successfully!");
        setMessageType("success");
        setTimeout(() => {
          setCurrentStep("password");
          setMessage("");
        }, 1500);
      } else {
        setMessage(result.message);
        setMessageType("error");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      setIsLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      setMessageType("error");
      setIsLoading(false);
      return;
    }

    try {
      // In a real implementation, you would call a password reset API
      // For now, we'll simulate the process
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setCurrentStep("success");
      setMessage("Password reset successfully!");
      setMessageType("success");
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (message) {
      setMessage("");
      setMessageType("");
    }
  };

  const renderEmailStep = () => (
    <form onSubmit={handleEmailSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="resetEmail" className="flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Email Address
        </Label>
        <Input
          id="resetEmail"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          placeholder="Enter your email address"
          required
          disabled={isLoading}
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !formData.email}
      >
        {isLoading ? "Sending..." : "Continue"}
      </Button>
    </form>
  );

  const renderOTPStep = () => (
    <div className="space-y-4">
      <EmailChecker
        email={formData.email}
        onOTPFound={(otp) => {
          handleInputChange("otp", otp);
          setMessage("OTP auto-filled from email!");
          setMessageType("success");
        }}
      />

      <form onSubmit={handleOTPSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="resetOtp" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Enter OTP
          </Label>
          <Input
            id="resetOtp"
            type="text"
            value={formData.otp}
            onChange={(e) => handleInputChange("otp", e.target.value)}
            placeholder="Enter 6-digit OTP"
            required
            disabled={isLoading}
            maxLength={6}
          />
          <p className="text-xs text-muted-foreground">
            Check your email for the 6-digit verification code
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentStep("email")}
            className="flex-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={isLoading || formData.otp.length !== 6}
          >
            {isLoading ? "Verifying..." : "Verify"}
          </Button>
        </div>
      </form>
    </div>
  );

  const renderPasswordStep = () => (
    <form onSubmit={handlePasswordSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="newPassword" className="flex items-center gap-2">
          <Lock className="w-4 h-4" />
          New Password
        </Label>
        <Input
          id="newPassword"
          type="password"
          value={formData.newPassword}
          onChange={(e) => handleInputChange("newPassword", e.target.value)}
          placeholder="Enter new password"
          required
          disabled={isLoading}
          minLength={6}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="flex items-center gap-2">
          <Lock className="w-4 h-4" />
          Confirm New Password
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
          placeholder="Confirm new password"
          required
          disabled={isLoading}
          minLength={6}
        />
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setCurrentStep("otp")}
          className="flex-1"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={
            isLoading || !formData.newPassword || !formData.confirmPassword
          }
        >
          {isLoading ? "Updating..." : "Reset Password"}
        </Button>
      </div>
    </form>
  );

  const renderSuccessStep = () => (
    <div className="text-center space-y-4">
      <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
      <h3 className="text-lg font-semibold">Password Reset Successful!</h3>
      <p className="text-muted-foreground">
        Your password has been reset successfully. You can now sign in with your
        new password.
      </p>
      <Button
        onClick={() => {
          setIsOpen(false);
          resetForm();
        }}
        className="w-full"
      >
        Close
      </Button>
    </div>
  );

  const getStepTitle = () => {
    switch (currentStep) {
      case "email":
        return "Enter Email";
      case "otp":
        return "Verify OTP";
      case "password":
        return "Set New Password";
      case "success":
        return "Password Reset";
      default:
        return "Forgot Password";
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetForm();
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            {getStepTitle()}
          </DialogTitle>
        </DialogHeader>

        {message && (
          <Alert
            className={`${messageType === "success" ? "border-success bg-success/10" : "border-destructive bg-destructive/10"}`}
          >
            {messageType === "success" ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            <AlertDescription
              className={
                messageType === "success" ? "text-success" : "text-destructive"
              }
            >
              {message}
            </AlertDescription>
          </Alert>
        )}

        {currentStep === "email" && renderEmailStep()}
        {currentStep === "otp" && renderOTPStep()}
        {currentStep === "password" && renderPasswordStep()}
        {currentStep === "success" && renderSuccessStep()}
      </DialogContent>
    </Dialog>
  );
}

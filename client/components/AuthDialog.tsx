import { useState } from "react";
import {
  User,
  Mail,
  Lock,
  UserPlus,
  LogIn,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { ForgotPasswordDialog } from "./ForgotPasswordDialog";
import {
  EmailValidationResponse,
  SendOTPResponse,
  VerifyOTPResponse,
} from "@shared/api";
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
import { useServer } from "../contexts/ServerContext";

interface AuthDialogProps {
  mode: "login" | "register";
  trigger: React.ReactNode;
}

// Removed OTP step from registration

export function AuthDialog({ mode, trigger }: AuthDialogProps) {
  const { login, register } = useServer();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // OTP only used in forgot password now
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    // otp removed from registration
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      if (mode === "login") {
        const success = await login(formData.email, formData.password);
        if (success) {
          setMessage("Login successful! Welcome back!");
          setMessageType("success");
          setTimeout(() => {
            setIsOpen(false);
            resetForm();
          }, 1500);
        } else {
          setMessage("Invalid email or password. Please try again.");
          setMessageType("error");
        }
      } else {
        // For registration, validate email first
        const emailValidation = await fetch("/api/validate-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        });

        const emailResult: EmailValidationResponse =
          await emailValidation.json();

        if (!emailResult.isValid) {
          setMessage(emailResult.message);
          setMessageType("error");
          return;
        }

        // Email is valid, register directly (no OTP needed)
        const success = await register(
          formData.username,
          formData.email,
          formData.password,
        );
        if (success) {
          setMessage("Registration successful! Welcome to THLIGHT Panel!");
          setMessageType("success");
          setTimeout(() => {
            setIsOpen(false);
            resetForm();
          }, 1500);
        } else {
          setMessage("Registration failed. Username or email already exists.");
          setMessageType("error");
        }
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  // OTP submit removed from registration

  const resetForm = () => {
    setFormData({ username: "", email: "", password: "" });
    setMessage("");
    setMessageType("");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (message) {
      setMessage("");
      setMessageType("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === "login" ? (
              <>
                <LogIn className="w-5 h-5" />
                Sign In to THLIGHT Panel
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Create Your Account
              </>
            )}
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

        {
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {mode === "register" && (
              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  placeholder="Enter your username"
                  required={mode === "register"}
                  disabled={isLoading}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Enter your password"
                required
                disabled={isLoading}
                minLength={6}
              />
              {mode === "register" && (
                <p className="text-xs text-muted-foreground">
                  Password must be at least 6 characters long
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={
                isLoading ||
                (mode === "register" &&
                  (!formData.username || !formData.email || !formData.password))
              }
            >
              {isLoading ? (
                "Please wait..."
              ) : mode === "login" ? (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Account
                </>
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground space-y-2">
              {mode === "login" ? (
                <>
                  <p>New to THLIGHT Panel? Register to get started!</p>
                  <div className="flex justify-start">
                    <ForgotPasswordDialog
                      trigger={
                        <button
                          type="button"
                          className="text-xs text-primary hover:underline"
                        >
                          Forgot Password?
                        </button>
                      }
                    />
                  </div>
                </>
              ) : (
                <p>Already have an account? Sign in to continue!</p>
              )}
            </div>
          </form>
        }
      </DialogContent>
    </Dialog>
  );
}

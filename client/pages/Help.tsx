import { useState } from "react";
import {
  ArrowLeft,
  Server,
  CreditCard,
  Globe,
  Shield,
  Users,
  Settings,
  Play,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Crown,
  Mail,
  Lock,
  Monitor,
  HardDrive,
  Cpu,
  Network,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

export default function Help() {
  const [activeSection, setActiveSection] = useState<string>("overview");

  const serverPlans = [
    {
      name: "Free",
      ram: "2GB",
      disk: "10GB",
      cpu: "50%",
      price: "Free",
      color: "text-green-400",
    },
    {
      name: "Basic",
      ram: "4GB",
      disk: "20GB",
      cpu: "100%",
      price: "₹250/month",
      color: "text-blue-400",
    },
    {
      name: "Standard",
      ram: "8GB",
      disk: "40GB",
      cpu: "150%",
      price: "₹500/month",
      color: "text-purple-400",
    },
    {
      name: "Premium",
      ram: "16GB",
      disk: "80GB",
      cpu: "200%",
      price: "₹1000/month",
      color: "text-yellow-400",
    },
    {
      name: "Pro",
      ram: "32GB",
      disk: "160GB",
      cpu: "300%",
      price: "₹2000/month",
      color: "text-red-400",
    },
    {
      name: "Ultimate",
      ram: "64GB",
      disk: "320GB",
      cpu: "400%",
      price: "₹4000/month",
      color: "text-indigo-400",
    },
    {
      name: "Enterprise",
      ram: "128GB",
      disk: "640GB",
      cpu: "500%",
      price: "₹7500/month",
      color: "text-pink-400",
    },
    {
      name: "Infinity",
      ram: "∞",
      disk: "∞",
      cpu: "∞",
      price: "₹25000/month",
      color: "text-orange-400",
    },
  ];

  const domainPlans = [
    {
      name: "1 Month",
      duration: "1 Month",
      price: "₹50",
      features: ["Custom subdomain", "Basic DNS management"],
    },
    {
      name: "6 Months",
      duration: "6 Months",
      price: "₹250",
      features: ["Custom subdomain", "Advanced DNS", "Priority support"],
    },
    {
      name: "1 Year",
      duration: "1 Year",
      price: "₹450",
      features: [
        "Custom subdomain",
        "Full DNS control",
        "Priority support",
        "Best Value",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (window.history.length > 1) {
                  window.history.back();
                } else {
                  window.location.href = "/dashboard";
                }
              }}
              className="text-gray-300 hover:text-white hover:bg-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Shield className="w-8 h-8 text-blue-400" />
                THLIGHT Help Center
              </h1>
              <p className="text-gray-400 mt-1">
                Complete guide to creating servers and managing your plans
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800 border-gray-700 sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg text-white">
                  Quick Navigation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { id: "overview", label: "Getting Started", icon: Play },
                  { id: "account", label: "Account Setup", icon: Users },
                  { id: "servers", label: "Creating Servers", icon: Server },
                  { id: "plans", label: "Server Plans", icon: Monitor },
                  { id: "domains", label: "Domain Plans", icon: Globe },
                  {
                    id: "management",
                    label: "Server Management",
                    icon: Settings,
                  },
                  { id: "owner", label: "Owner Privileges", icon: Crown },
                ].map((item) => (
                  <Button
                    key={item.id}
                    variant={activeSection === item.id ? "default" : "ghost"}
                    size="sm"
                    className={`w-full justify-start ${
                      activeSection === item.id
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:text-white hover:bg-gray-700"
                    }`}
                    onClick={() => setActiveSection(item.id)}
                  >
                    <item.icon className="w-4 h-4 mr-3" />
                    {item.label}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Getting Started */}
            {activeSection === "overview" && (
              <div className="space-y-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Play className="w-5 h-5 text-green-400" />
                      Welcome to THLIGHT
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-300">
                      THLIGHT is a powerful Minecraft server hosting platform
                      that allows you to create, manage, and customize your
                      servers with ease.
                    </p>

                    <Alert className="border-blue-500 bg-blue-500/10">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      <AlertDescription className="text-blue-300">
                        <strong>Quick Start:</strong> Sign up → Choose a plan →
                        Create your server → Start playing!
                      </AlertDescription>
                    </Alert>

                    <div className="grid gap-4 md:grid-cols-2">
                      <Card className="bg-gray-700 border-gray-600">
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                            <Server className="w-4 h-4 text-green-400" />
                            Server Management
                          </h3>
                          <p className="text-gray-300 text-sm">
                            Create unlimited servers, manage settings, and
                            monitor performance.
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="bg-gray-700 border-gray-600">
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                            <Globe className="w-4 h-4 text-blue-400" />
                            Custom Domains
                          </h3>
                          <p className="text-gray-300 text-sm">
                            Use custom domains like play.yourserver.com for
                            professional branding.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Account Setup */}
            {activeSection === "account" && (
              <div className="space-y-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-400" />
                      Account Setup Guide
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="signup" className="border-gray-600">
                        <AccordionTrigger className="text-white hover:text-blue-400">
                          1. Creating Your Account
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-300 space-y-3">
                          <div className="space-y-2">
                            <p>
                              <strong>Step 1:</strong> Click "Sign In" on the
                              homepage
                            </p>
                            <p>
                              <strong>Step 2:</strong> Select "Sign Up" tab
                            </p>
                            <p>
                              <strong>Step 3:</strong> Enter your details:
                            </p>
                            <ul className="list-disc list-inside ml-4 space-y-1">
                              <li>Username (unique identifier)</li>
                              <li>Email (must be a valid Gmail address)</li>
                              <li>Strong password</li>
                            </ul>
                          </div>
                          <Alert className="border-yellow-500 bg-yellow-500/10">
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            <AlertDescription className="text-yellow-300">
                              Only Gmail addresses are accepted for account
                              creation.
                            </AlertDescription>
                          </Alert>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem
                        value="verification"
                        className="border-gray-600"
                      >
                        <AccordionTrigger className="text-white hover:text-blue-400">
                          2. Email Verification
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-300 space-y-3">
                          <p>
                            After signing up, you'll receive an OTP (One-Time
                            Password) for verification:
                          </p>
                          <ul className="list-disc list-inside space-y-1">
                            <li>
                              Check your Gmail inbox for the verification code
                            </li>
                            <li>
                              Enter the 6-digit code in the verification dialog
                            </li>
                            <li>Your account will be activated immediately</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="signin" className="border-gray-600">
                        <AccordionTrigger className="text-white hover:text-blue-400">
                          3. Signing In
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-300 space-y-3">
                          <p>
                            Once your account is created, you can sign in
                            anytime:
                          </p>
                          <ul className="list-disc list-inside space-y-1">
                            <li>Enter your email and password</li>
                            <li>Click "Sign In"</li>
                            <li>
                              You'll be redirected to your personal dashboard
                            </li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Server Creation */}
            {activeSection === "servers" && (
              <div className="space-y-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Server className="w-5 h-5 text-green-400" />
                      Creating Your First Server
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="create" className="border-gray-600">
                        <AccordionTrigger className="text-white hover:text-green-400">
                          Step-by-Step Server Creation
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-300 space-y-4">
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <Badge className="bg-green-600 text-white min-w-[24px] h-6 flex items-center justify-center">
                                1
                              </Badge>
                              <div>
                                <h4 className="font-semibold text-white">
                                  Access Dashboard
                                </h4>
                                <p>
                                  Navigate to your dashboard after signing in
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <Badge className="bg-green-600 text-white min-w-[24px] h-6 flex items-center justify-center">
                                2
                              </Badge>
                              <div>
                                <h4 className="font-semibold text-white">
                                  Click "Create Server"
                                </h4>
                                <p>
                                  Look for the blue "Create Server" button and
                                  click it
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <Badge className="bg-green-600 text-white min-w-[24px] h-6 flex items-center justify-center">
                                3
                              </Badge>
                              <div>
                                <h4 className="font-semibold text-white">
                                  Choose Server Plan
                                </h4>
                                <p>
                                  Select from Free, Basic, Standard, Premium, or
                                  higher tiers
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <Badge className="bg-green-600 text-white min-w-[24px] h-6 flex items-center justify-center">
                                4
                              </Badge>
                              <div>
                                <h4 className="font-semibold text-white">
                                  Enter Server Details
                                </h4>
                                <ul className="list-disc list-inside mt-1 space-y-1">
                                  <li>
                                    Server Name (e.g., "My Awesome Server")
                                  </li>
                                  <li>
                                    Network Location (choose closest to your
                                    players)
                                  </li>
                                  <li>
                                    Custom Domain (optional, requires domain
                                    plan)
                                  </li>
                                </ul>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <Badge className="bg-green-600 text-white min-w-[24px] h-6 flex items-center justify-center">
                                5
                              </Badge>
                              <div>
                                <h4 className="font-semibold text-white">
                                  Create & Configure
                                </h4>
                                <p>
                                  Click "Create Server" and your server will be
                                  ready instantly!
                                </p>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="limits" className="border-gray-600">
                        <AccordionTrigger className="text-white hover:text-green-400">
                          Server Limits & Restrictions
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-300 space-y-3">
                          <div className="grid gap-4 md:grid-cols-2">
                            <Card className="bg-gray-700 border-gray-600">
                              <CardContent className="p-4">
                                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                                  <Users className="w-4 h-4 text-blue-400" />
                                  Regular Users
                                </h4>
                                <ul className="text-gray-300 text-sm space-y-1">
                                  <li>• 1 Free server per account</li>
                                  <li>• Unlimited paid servers</li>
                                  <li>• Personal dashboard access</li>
                                </ul>
                              </CardContent>
                            </Card>

                            <Card className="bg-gray-700 border-gray-600">
                              <CardContent className="p-4">
                                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                                  <Crown className="w-4 h-4 text-yellow-400" />
                                  Owner Privileges
                                </h4>
                                <ul className="text-gray-300 text-sm space-y-1">
                                  <li>• Unlimited free servers</li>
                                  <li>• All plans are free</li>
                                  <li>• Admin management access</li>
                                </ul>
                              </CardContent>
                            </Card>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Server Plans */}
            {activeSection === "plans" && (
              <div className="space-y-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Monitor className="w-5 h-5 text-purple-400" />
                      Server Plans & Pricing
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-gray-300">
                      Choose the perfect plan for your Minecraft server based on
                      your needs and player count.
                    </p>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {serverPlans.map((plan) => (
                        <Card
                          key={plan.name}
                          className="bg-gray-700 border-gray-600"
                        >
                          <CardContent className="p-4">
                            <div className="text-center space-y-2">
                              <h3 className={`text-lg font-bold ${plan.color}`}>
                                {plan.name}
                              </h3>
                              <div className="text-2xl font-bold text-white">
                                {plan.price}
                              </div>
                              <Separator className="bg-gray-600" />
                              <div className="space-y-1 text-sm text-gray-300">
                                <div className="flex items-center justify-between">
                                  <span className="flex items-center gap-1">
                                    <HardDrive className="w-3 h-3" />
                                    RAM
                                  </span>
                                  <span className="font-semibold">
                                    {plan.ram}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="flex items-center gap-1">
                                    <Monitor className="w-3 h-3" />
                                    Disk
                                  </span>
                                  <span className="font-semibold">
                                    {plan.disk}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="flex items-center gap-1">
                                    <Cpu className="w-3 h-3" />
                                    CPU
                                  </span>
                                  <span className="font-semibold">
                                    {plan.cpu}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <Alert className="border-blue-500 bg-blue-500/10">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      <AlertDescription className="text-blue-300">
                        <strong>Pro Tip:</strong> Start with a Free plan to test
                        your server, then upgrade as your community grows!
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Domain Plans */}
            {activeSection === "domains" && (
              <div className="space-y-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Globe className="w-5 h-5 text-blue-400" />
                      Domain Plans & Custom URLs
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-gray-300">
                      Get custom domains for your server to create a
                      professional and memorable experience for your players.
                    </p>

                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem
                        value="benefits"
                        className="border-gray-600"
                      >
                        <AccordionTrigger className="text-white hover:text-blue-400">
                          Why Use Custom Domains?
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-300 space-y-3">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <h4 className="font-semibold text-white">
                                Professional Branding
                              </h4>
                              <p className="text-sm">
                                Instead of complex IP addresses, your players
                                can connect using memorable domains like:
                              </p>
                              <ul className="text-sm space-y-1">
                                <li>• play.yourserver.com</li>
                                <li>• mc.gaming.net</li>
                                <li>• survival.fun</li>
                              </ul>
                            </div>
                            <div className="space-y-2">
                              <h4 className="font-semibold text-white">
                                Enhanced Features
                              </h4>
                              <ul className="text-sm space-y-1">
                                <li>• DNS management</li>
                                <li>• SSL certificates</li>
                                <li>• Subdomain support</li>
                                <li>• Priority technical support</li>
                              </ul>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem
                        value="pricing"
                        className="border-gray-600"
                      >
                        <AccordionTrigger className="text-white hover:text-blue-400">
                          Domain Plan Pricing
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-300">
                          <div className="grid gap-4 md:grid-cols-3">
                            {domainPlans.map((plan) => (
                              <Card
                                key={plan.name}
                                className="bg-gray-700 border-gray-600"
                              >
                                <CardContent className="p-4 text-center">
                                  <h4 className="font-bold text-white text-lg">
                                    {plan.name}
                                  </h4>
                                  <div className="text-2xl font-bold text-blue-400 my-2">
                                    {plan.price}
                                  </div>
                                  <p className="text-gray-400 text-sm mb-3">
                                    {plan.duration} Access
                                  </p>
                                  <ul className="text-xs space-y-1">
                                    {plan.features.map((feature, index) => (
                                      <li
                                        key={index}
                                        className="flex items-center gap-1"
                                      >
                                        <CheckCircle className="w-3 h-3 text-green-400" />
                                        {feature}
                                      </li>
                                    ))}
                                  </ul>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem
                        value="purchase"
                        className="border-gray-600"
                      >
                        <AccordionTrigger className="text-white hover:text-blue-400">
                          How to Purchase Domain Plans
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-300 space-y-3">
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <Badge className="bg-blue-600 text-white min-w-[24px] h-6 flex items-center justify-center">
                                1
                              </Badge>
                              <div>
                                <h4 className="font-semibold text-white">
                                  Access Server Creation
                                </h4>
                                <p>
                                  Go to your dashboard and click "Create Server"
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <Badge className="bg-blue-600 text-white min-w-[24px] h-6 flex items-center justify-center">
                                2
                              </Badge>
                              <div>
                                <h4 className="font-semibold text-white">
                                  Enter Custom Domain
                                </h4>
                                <p>
                                  In the domain field, enter a domain containing
                                  "play", "net", or "fun"
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <Badge className="bg-blue-600 text-white min-w-[24px] h-6 flex items-center justify-center">
                                3
                              </Badge>
                              <div>
                                <h4 className="font-semibold text-white">
                                  Purchase Domain Plan
                                </h4>
                                <p>
                                  Click "Domain Plan" button and select your
                                  preferred duration
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <Badge className="bg-blue-600 text-white min-w-[24px] h-6 flex items-center justify-center">
                                4
                              </Badge>
                              <div>
                                <h4 className="font-semibold text-white">
                                  Complete Purchase
                                </h4>
                                <p>
                                  Click "Purchase Domain Plan" to activate your
                                  custom domain
                                </p>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Server Management */}
            {activeSection === "management" && (
              <div className="space-y-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Settings className="w-5 h-5 text-gray-400" />
                      Server Management Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem
                        value="console"
                        className="border-gray-600"
                      >
                        <AccordionTrigger className="text-white hover:text-gray-400">
                          Console & Command Management
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-300 space-y-3">
                          <p>Access your server console to:</p>
                          <ul className="list-disc list-inside space-y-1">
                            <li>Execute server commands</li>
                            <li>Monitor server logs in real-time</li>
                            <li>Start, stop, and restart your server</li>
                            <li>Manage player slots and server settings</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem
                        value="settings"
                        className="border-gray-600"
                      >
                        <AccordionTrigger className="text-white hover:text-gray-400">
                          Server Settings Configuration
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-300 space-y-3">
                          <p>
                            Customize your server with comprehensive settings:
                          </p>
                          <div className="grid gap-3 md:grid-cols-2">
                            <div>
                              <h4 className="font-semibold text-white">
                                Basic Settings
                              </h4>
                              <ul className="text-sm space-y-1">
                                <li>• Server name & MOTD</li>
                                <li>• Player slots</li>
                                <li>• Game mode</li>
                                <li>• Difficulty level</li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold text-white">
                                Advanced Settings
                              </h4>
                              <ul className="text-sm space-y-1">
                                <li>• World generation</li>
                                <li>• Security options</li>
                                <li>• Performance tuning</li>
                                <li>• Plugin management</li>
                              </ul>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem
                        value="players"
                        className="border-gray-600"
                      >
                        <AccordionTrigger className="text-white hover:text-gray-400">
                          Player Management
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-300 space-y-3">
                          <p>Manage your player community:</p>
                          <ul className="list-disc list-inside space-y-1">
                            <li>View online/offline player lists</li>
                            <li>Kick or ban problematic players</li>
                            <li>Manage whitelist and permissions</li>
                            <li>Monitor player activity and statistics</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Owner Privileges */}
            {activeSection === "owner" && (
              <div className="space-y-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Crown className="w-5 h-5 text-yellow-400" />
                      Owner Privileges (kaverimaynale@gmail.com)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Alert className="border-yellow-500 bg-yellow-500/10">
                      <Crown className="h-4 w-4 text-yellow-500" />
                      <AlertDescription className="text-yellow-300">
                        <strong>Owner Account:</strong> Special privileges are
                        granted to kaverimaynale@gmail.com
                      </AlertDescription>
                    </Alert>

                    <div className="grid gap-4 md:grid-cols-2">
                      <Card className="bg-gray-700 border-yellow-500">
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                            <Server className="w-4 h-4 text-yellow-400" />
                            Server Privileges
                          </h3>
                          <ul className="text-gray-300 text-sm space-y-1">
                            <li>• Unlimited free servers</li>
                            <li>• All server plans are FREE</li>
                            <li>• No server creation limits</li>
                            <li>• Access to all features</li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="bg-gray-700 border-yellow-500">
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                            <Globe className="w-4 h-4 text-yellow-400" />
                            Domain Privileges
                          </h3>
                          <ul className="text-gray-300 text-sm space-y-1">
                            <li>• All domain plans are FREE</li>
                            <li>• Unlimited custom domains</li>
                            <li>• No domain restrictions</li>
                            <li>• Premium DNS features</li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="bg-gray-700 border-yellow-500">
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-yellow-400" />
                            Admin Management
                          </h3>
                          <ul className="text-gray-300 text-sm space-y-1">
                            <li>• Access to MANAGE panel</li>
                            <li>• User & server administration</li>
                            <li>• Ban/unban capabilities</li>
                            <li>• Grant premium servers</li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="bg-gray-700 border-yellow-500">
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                            <Users className="w-4 h-4 text-yellow-400" />
                            Platform Control
                          </h3>
                          <ul className="text-gray-300 text-sm space-y-1">
                            <li>• Manage all user accounts</li>
                            <li>�� Delete any server</li>
                            <li>• View activity logs</li>
                            <li>• Platform-wide oversight</li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="bg-red-900/20 border-red-500">
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-red-400 mb-2 flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          Access Restriction
                        </h3>
                        <p className="text-red-300 text-sm">
                          The MANAGE panel and owner privileges are exclusively
                          available to kaverimaynale@gmail.com. Other users
                          attempting to access admin features will see an access
                          denied message.
                        </p>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

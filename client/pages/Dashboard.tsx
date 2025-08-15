import { useState } from "react";
import { Link } from "react-router-dom";
import { useServer } from "../contexts/ServerContext";
import { ServerLimitWarning } from "../components/ServerLimitWarning";
import {
  Plus,
  Server,
  Settings,
  Play,
  Square,
  Users,
  HardDrive,
  Cpu,
  MemoryStick,
  Globe,
  AlertTriangle,
  CheckCircle,
  LogOut,
  User as UserIcon,
  Edit,
  Trash2,
  Shield,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ServerPlan {
  id: string;
  name: string;
  ram: string;
  disk: string;
  cpu: string;
  price: string;
  isFree: boolean;
}

const serverPlans: ServerPlan[] = [
  {
    id: "free",
    name: "Free",
    ram: "2GB",
    disk: "10GB",
    cpu: "50%",
    price: "Free",
    isFree: true,
  },
  {
    id: "basic",
    name: "Basic",
    ram: "4GB",
    disk: "20GB",
    cpu: "100%",
    price: "₹250/month",
    isFree: false,
  },
  {
    id: "standard",
    name: "Standard",
    ram: "8GB",
    disk: "40GB",
    cpu: "150%",
    price: "₹500/month",
    isFree: false,
  },
  {
    id: "premium",
    name: "Premium",
    ram: "16GB",
    disk: "80GB",
    cpu: "200%",
    price: "₹1000/month",
    isFree: false,
  },
  {
    id: "pro",
    name: "Pro",
    ram: "32GB",
    disk: "160GB",
    cpu: "300%",
    price: "₹2000/month",
    isFree: false,
  },
  {
    id: "ultimate",
    name: "Ultimate",
    ram: "64GB",
    disk: "320GB",
    cpu: "400%",
    price: "₹4000/month",
    isFree: false,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    ram: "100GB",
    disk: "1TB",
    cpu: "500%",
    price: "₹7500/month",
    isFree: false,
  },
  {
    id: "infinity",
    name: "Infinity",
    ram: "∞",
    disk: "∞",
    cpu: "∞",
    price: "₹25000/month",
    isFree: false,
  },
];

const countries = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "France",
  "Netherlands",
  "Australia",
  "Japan",
  "Singapore",
  "Brazil",
  "India",
  "South Korea",
];

export default function Dashboard() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDomainPlanOpen, setIsDomainPlanOpen] = useState(false);
  const [serverName, setServerName] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [customDomain, setCustomDomain] = useState("");
  const [domainError, setDomainError] = useState("");
  const [selectedDomainPlan, setSelectedDomainPlan] = useState<string>("");
  const [hasDomainPlan, setHasDomainPlan] = useState(false);
  const [showServerSuccess, setShowServerSuccess] = useState(false);
  const [showDomainSuccess, setShowDomainSuccess] = useState(false);
  const [showServerLimitWarning, setShowServerLimitWarning] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [serverToDelete, setServerToDelete] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    servers,
    setServers,
    user,
    logout,
    setCurrentServerId,
    getUserServers,
    canCreateServer,
    getUserServerCount,
    getFreeServerCount,
  } = useServer();

  const userServers = getUserServers();

  const handleManageServer = (serverId: number) => {
    setCurrentServerId(serverId);
  };

  const handleDomainChange = (value: string) => {
    setCustomDomain(value);
    const restrictedDomains = ["net", "play", "fun"];
    const hasRestrictedDomain = restrictedDomains.some((domain) =>
      value.toLowerCase().includes(domain),
    );

    // Owner gets all domain privileges for free
    if (user?.email === "kaverimaynale@gmail.com") {
      setHasDomainPlan(true);
      setDomainError("");
    } else if (hasRestrictedDomain && !hasDomainPlan) {
      setDomainError(
        "YOU ARE NOT ALLOW TO USE PLAY,NET,FUN FOR THAT TAKE A PLAN",
      );
    } else {
      setDomainError("");
    }
  };

  const handleDomainPlanPurchase = () => {
    if (!selectedDomainPlan) return;

    // Owner gets all domain plans for free
    if (user?.email === "kaverimaynale@gmail.com") {
      console.log("Owner getting free domain plan:", selectedDomainPlan);
      setHasDomainPlan(true);
      setIsDomainPlanOpen(false);
      setShowDomainSuccess(true);
      setSelectedDomainPlan("");
      return;
    }

    // Handle domain plan purchase logic for other users
    console.log("Purchasing domain plan:", selectedDomainPlan);
    setHasDomainPlan(true);
    setIsDomainPlanOpen(false);
    setShowDomainSuccess(true);
    setSelectedDomainPlan("");
  };

  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        alert("IP copied to clipboard!");
        return;
      }

      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (successful) {
        alert("IP copied to clipboard!");
      } else {
        prompt("Copy this IP address:", text);
      }
    } catch (err) {
      console.error("Failed to copy: ", err);
      prompt("Copy this IP address:", text);
    }
  };

  const handleCreateServer = () => {
    if (!serverName || !selectedPlan || !selectedCountry) {
      return;
    }

    const planData = serverPlans.find((p) => p.id === selectedPlan);
    const planName = planData?.name || "Free";

    // Owner gets unlimited free servers
    if (user?.email === "kaverimaynale@gmail.com") {
      // Owner can create any plan for free, so convert to Free plan
      // but keep the original plan details for display
    } else {
      // Check server limit (only for free servers for other users)
      if (planName === "Free" && !canCreateServer(planName)) {
        setShowServerLimitWarning(true);
        setIsCreateDialogOpen(false);
        return;
      }
    }
    let planDetails = { ram: 2, disk: 10, cpu: 50 };

    if (planData) {
      const ramMatch = planData.ram.match(/\d+/);
      const diskMatch = planData.disk.match(/\d+/);
      const cpuMatch = planData.cpu.match(/\d+/);

      planDetails = {
        ram: ramMatch ? parseInt(ramMatch[0]) : planData.ram === "∞" ? 999 : 2,
        disk: diskMatch
          ? parseInt(diskMatch[0])
          : planData.disk === "∞"
            ? 9999
            : 10,
        cpu: cpuMatch ? parseInt(cpuMatch[0]) : planData.cpu === "∞" ? 100 : 50,
      };

      if (planData.disk.includes("TB")) {
        planDetails.disk = planDetails.disk * 1000;
      }
    }

    const newServer = {
      id: Date.now(),
      name: serverName,
      status: "offline" as const,
      players: "0/20",
      version: "1.21.4",
      plan: planData?.name || "Free",
      planDetails,
      country: selectedCountry,
      ownerEmail: user?.email || "",
      playerSlots: 20,
      currentPlayers: 0,
      serverConfig: {
        slots: 20,
        gamemode: "Survival",
        difficulty: "Normal",
        whitelist: false,
        pvp: true,
        cracked: false,
        commandblocks: true,
        monster: true,
        fly: true,
        nether: true,
      },
    };

    setServers((prev) => [...prev, newServer]);
    setCurrentServerId(newServer.id);
    setIsCreateDialogOpen(false);
    setShowServerSuccess(true);

    setServerName("");
    setSelectedPlan("");
    setSelectedCountry("");
    setCustomDomain("");
    setDomainError("");
  };

  const handleDeleteServer = (server: any) => {
    setServerToDelete(server);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteServer = () => {
    if (serverToDelete) {
      setServers((prev) =>
        prev.filter((server) => server.id !== serverToDelete.id),
      );
      setShowDeleteSuccess(true);
      setShowDeleteConfirm(false);
      setServerToDelete(null);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowDeleteSuccess(false);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (window.history.length > 1) {
                    window.history.back();
                  } else {
                    window.location.href = "/";
                  }
                }}
                className="text-gray-300 hover:text-white hover:bg-gray-700 mr-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-blue-500 text-white">
                <span className="font-bold text-lg">T</span>
              </div>
              <span className="text-2xl font-bold text-blue-400">THLIGHT</span>

              {/* Owner MANAGE Button */}
              {user?.email === "kaverimaynale@gmail.com" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-red-600 text-white hover:bg-red-700 ml-4"
                  onClick={() => (window.location.href = "/admin/manage")}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  MANAGE
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="bg-blue-500 text-white hover:bg-blue-600 ml-4"
                onClick={() => (window.location.href = "/help")}
              >
                Help
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-white"
              >
                Servers
              </Button>
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-white"
              >
                Account
              </Button>
              <Dialog
                open={isDomainPlanOpen}
                onOpenChange={setIsDomainPlanOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Domain Plan
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md bg-gray-800 border-gray-700">
                  <DialogHeader>
                    <DialogTitle className="text-gray-200">
                      Domain Plans
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Card
                        className={`cursor-pointer transition-all bg-gray-700 border-gray-600 ${
                          selectedDomainPlan === "1month"
                            ? "ring-2 ring-primary border-primary"
                            : "hover:shadow-md"
                        }`}
                        onClick={() => setSelectedDomainPlan("1month")}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-200">
                                Custom Domain
                              </h3>
                              <p className="text-sm text-gray-400">
                                1 Month Access
                              </p>
                            </div>
                            <div className="text-lg font-bold text-primary">
                              {user?.email === "kaverimaynale@gmail.com"
                                ? "Free"
                                : "₹50"}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card
                        className={`cursor-pointer transition-all bg-gray-700 border-gray-600 ${
                          selectedDomainPlan === "6months"
                            ? "ring-2 ring-primary border-primary"
                            : "hover:shadow-md"
                        }`}
                        onClick={() => setSelectedDomainPlan("6months")}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-200">
                                Custom Domain
                              </h3>
                              <p className="text-sm text-gray-400">
                                6 Months Access
                              </p>
                            </div>
                            <div className="text-lg font-bold text-primary">
                              {user?.email === "kaverimaynale@gmail.com"
                                ? "Free"
                                : "₹250"}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card
                        className={`cursor-pointer transition-all bg-gray-700 border-gray-600 ${
                          selectedDomainPlan === "1year"
                            ? "ring-2 ring-primary border-primary"
                            : "hover:shadow-md"
                        }`}
                        onClick={() => setSelectedDomainPlan("1year")}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-200">
                                Custom Domain
                              </h3>
                              <p className="text-sm text-gray-400">
                                1 Year Access
                              </p>
                              <Badge
                                variant="secondary"
                                className="bg-green-600 text-green-100 mt-1"
                              >
                                Best Value
                              </Badge>
                            </div>
                            <div className="text-lg font-bold text-primary">
                              {user?.email === "kaverimaynale@gmail.com"
                                ? "Free"
                                : "₹450"}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Button
                      onClick={handleDomainPlanPurchase}
                      disabled={!selectedDomainPlan}
                      className="w-full bg-blue-500 hover:bg-blue-600"
                    >
                      {user?.email === "kaverimaynale@gmail.com"
                        ? "Get Free Domain Plan"
                        : "Purchase Domain Plan"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded-lg">
                <UserIcon className="w-4 h-4 text-gray-300" />
                <span className="text-sm font-medium text-gray-300">
                  {user?.username}
                </span>
              </div>
              <Button
                variant="outline"
                onClick={logout}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Server Limit Warning */}
        {showServerLimitWarning && (
          <ServerLimitWarning
            onClose={() => setShowServerLimitWarning(false)}
          />
        )}

        {/* Delete Success Message */}
        {showDeleteSuccess && (
          <Alert className="border-green-500 bg-green-500/10 mb-6">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-500 font-medium">
              Server deleted successfully!
            </AlertDescription>
          </Alert>
        )}

        {/* Success Messages */}
        {showServerSuccess && (
          <Alert className="border-green-500 bg-green-500/10 mb-6">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription className="flex items-center justify-between">
              <span className="text-green-500 font-medium">
                YOU ARE SUCCESSFULLY CREATED A SERVER JOIN OFFICIAL SERVER OF
                OWNER IP thlight.join-mc.net
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard("thlight.join-mc.net")}
                className="ml-4 border-green-500 text-green-500 hover:bg-green-500/10"
              >
                Copy IP
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {showDomainSuccess && (
          <Alert className="border-green-500 bg-green-500/10 mb-6">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription className="flex items-center justify-between">
              <span className="text-green-500 font-medium">
                YOU ARE SUCCESSFULLY PURCHASED DOMAIN PLAN JOIN OFFICIAL SERVER
                OF OWNER IP thlight.join-mc.net
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard("thlight.join-mc.net")}
                className="ml-4 border-green-500 text-green-500 hover:bg-green-500/10"
              >
                Copy IP
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Servers Section */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-center text-blue-400">
            Servers
          </h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-gray-200">
                    Create New Server
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="serverName" className="text-gray-200">
                      Server Name
                    </Label>
                    <Input
                      id="serverName"
                      value={serverName}
                      onChange={(e) => setServerName(e.target.value)}
                      placeholder="Enter your server name"
                      className="bg-gray-700 border-gray-600 text-gray-200"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-gray-200">Choose a Plan</Label>
                    <div className="grid gap-3 md:grid-cols-2">
                      {serverPlans.map((plan) => (
                        <Card
                          key={plan.id}
                          className={`cursor-pointer transition-all bg-gray-700 border-gray-600 ${
                            selectedPlan === plan.id
                              ? "ring-2 ring-primary border-primary"
                              : "hover:shadow-md"
                          }`}
                          onClick={() => setSelectedPlan(plan.id)}
                        >
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg text-gray-200">
                                {plan.name}
                              </CardTitle>
                              {plan.isFree && (
                                <Badge
                                  variant="secondary"
                                  className="bg-green-600 text-green-100"
                                >
                                  Free
                                </Badge>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                              <MemoryStick className="w-4 h-4" />
                              <span>RAM: {plan.ram}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                              <HardDrive className="w-4 h-4" />
                              <span>Disk: {plan.disk}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                              <Cpu className="w-4 h-4" />
                              <span>CPU: {plan.cpu}</span>
                            </div>
                            <div className="text-lg font-bold text-blue-400">
                              {user?.email === "kaverimaynale@gmail.com"
                                ? "Free"
                                : plan.price}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-gray-200">
                      Network Location
                    </Label>
                    <Select
                      value={selectedCountry}
                      onValueChange={setSelectedCountry}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-200">
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4" />
                              {country}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Custom Domain */}
                  <div className="space-y-2">
                    <Label htmlFor="customDomain" className="text-gray-200">
                      Custom Domain (Optional)
                    </Label>
                    <Input
                      id="customDomain"
                      value={customDomain}
                      onChange={(e) => handleDomainChange(e.target.value)}
                      placeholder="play.minedeath.com"
                      className="bg-gray-700 border-gray-600 text-gray-200"
                    />
                    {domainError && (
                      <Alert className="border-red-500 bg-red-500/10">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <AlertDescription className="text-red-400">
                          {domainError}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <Button
                    onClick={handleCreateServer}
                    disabled={
                      !serverName ||
                      !selectedPlan ||
                      !selectedCountry ||
                      !!domainError
                    }
                    className="w-full bg-blue-500 hover:bg-blue-600"
                  >
                    Create Server
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Servers Grid */}
        {userServers.length === 0 ? (
          <Card className="text-center py-12 bg-gray-800 border-gray-700">
            <CardContent>
              <Server className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-gray-200">
                No servers yet
              </h3>
              <p className="text-gray-400 mb-4">
                Create your first Minecraft server to get started
              </p>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Server
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {userServers.map((server) => (
              <Card
                key={server.id}
                className="hover:shadow-md transition-shadow border-l-4 border-l-gray-500 bg-gray-800 border-gray-700"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center">
                        <span className="text-white font-bold">
                          {server.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-200">
                          {server.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>Vanilla {server.version}</span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {server.players}
                          </span>
                          <span>
                            {server.plan} ({server.planDetails.ram}GB RAM)
                          </span>
                          <span>{server.country}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          server.status === "online"
                            ? "bg-red-500"
                            : "bg-gray-500"
                        }`}
                      ></div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleManageServer(server.id)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        asChild
                      >
                        <Link to={`/console/${server.id}`}>
                          <Settings className="w-4 h-4 mr-2" />
                          Manage
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteServer(server)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent className="max-w-md bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-gray-200">Delete Server</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-300">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{serverToDelete?.name}</span>?
                This action cannot be undone.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDeleteServer}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Server
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

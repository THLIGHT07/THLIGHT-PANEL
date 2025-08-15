import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Play,
  Pause,
  RotateCcw,
  Server,
  Users,
  Activity,
  HardDrive,
  Cpu,
  MemoryStick,
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Zap,
  Settings,
  Save,
  Plus,
  Minus,
  Shield,
  Sword,
  Crown,
  Globe,
  Target,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useServer } from "../contexts/ServerContext";
import { OptionsDialog } from "../components/OptionsDialog";
import { VersionSelector } from "../components/VersionSelector";

export default function Console() {
  const [serverStatus, setServerStatus] = useState<
    "online" | "offline" | "starting" | "stopping"
  >("offline");
  const [isLoading, setIsLoading] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  // Use server context and URL params
  const { serverId } = useParams<{ serverId: string }>();
  const {
    getCurrentServer,
    getServerById,
    updateServerSpecs,
    updateServerConfig,
    setCurrentServerId,
    setServers,
    servers,
  } = useServer();

  // Get server based on URL parameter or fallback to current server
  const currentServer = serverId
    ? getServerById(parseInt(serverId))
    : getCurrentServer();

  // Set current server ID when component mounts
  useEffect(() => {
    if (serverId) {
      setCurrentServerId(parseInt(serverId));
    }
  }, [serverId, setCurrentServerId]);

  // Initialize specs from current server or defaults
  const [serverSpecs, setServerSpecs] = useState({
    ram: currentServer?.allocatedSpecs?.ram || 0,
    disk: currentServer?.allocatedSpecs?.disk || 0,
    cpu: currentServer?.allocatedSpecs?.cpu || 0,
  });

  // Server configuration settings
  const [serverConfig, setServerConfig] = useState({
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
  });

  // Update specs when server changes
  useEffect(() => {
    if (currentServer?.allocatedSpecs) {
      setServerSpecs(currentServer.allocatedSpecs);
    }
  }, [currentServer]);

  // Current server's plan limits
  const currentPlan = {
    name: currentServer?.plan || "Free",
    maxRam: currentServer?.planDetails.ram || 2,
    maxDisk: currentServer?.planDetails.disk || 10,
    maxCpu: currentServer?.planDetails.cpu || 50,
  };

  const handleServerAction = async (action: "start" | "stop" | "restart") => {
    setIsLoading(true);

    if (action === "start") {
      setServerStatus("starting");
      setTimeout(() => {
        setServerStatus("online");
        setIsLoading(false);
      }, 3000);
    } else if (action === "stop") {
      setServerStatus("stopping");
      setTimeout(() => {
        setServerStatus("offline");
        setIsLoading(false);
      }, 2000);
    } else if (action === "restart") {
      setServerStatus("stopping");
      setTimeout(() => {
        setServerStatus("starting");
        setTimeout(() => {
          setServerStatus("online");
          setIsLoading(false);
        }, 3000);
      }, 2000);
    }
  };

  const getStatusColor = (status: typeof serverStatus) => {
    switch (status) {
      case "online":
        return "bg-success text-success-foreground border-success";
      case "offline":
        return "bg-destructive text-destructive-foreground border-destructive";
      case "starting":
      case "stopping":
        return "bg-warning text-warning-foreground border-warning";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getStatusIcon = (status: typeof serverStatus) => {
    switch (status) {
      case "online":
        return <CheckCircle className="w-3 h-3" />;
      case "offline":
        return <AlertCircle className="w-3 h-3" />;
      case "starting":
      case "stopping":
        return <Clock className="w-3 h-3" />;
      default:
        return <AlertCircle className="w-3 h-3" />;
    }
  };

  const handleSaveSpecs = () => {
    if (currentServer) {
      updateServerSpecs(currentServer.id, serverSpecs);
      setIsOptionsOpen(false);
    }
  };

  const handleConfigSave = (config: any) => {
    if (currentServer) {
      updateServerConfig(currentServer.id, config);
    }
  };

  const handleVersionChange = (version: string, type: "vanilla" | "bukkit") => {
    if (currentServer) {
      setServers((prev) =>
        prev.map((server) =>
          server.id === currentServer.id
            ? { ...server, version: `${version} (${type})` }
            : server,
        ),
      );
    }
  };

  if (!currentServer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <Server className="w-12 h-12 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">No Server Selected</h1>
        <p className="text-muted-foreground">
          Please select a server from the dashboard
        </p>
      </div>
    );
  }

  return (
    <div
      className="space-y-6 min-h-screen relative"
      style={{
        backgroundImage: `url('https://cdn.builder.io/api/v1/image/assets%2F8a07adefa7b04c6480a71dbc4c060aec%2F7f1ba787b70245adadfab80cdc1c3caa?format=webp&width=800')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Background overlay for better readability */}
      <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm"></div>

      {/* Content wrapper */}
      <div className="relative z-10 space-y-6">
        {/* Back Button */}
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
          className="text-gray-300 hover:text-white hover:bg-gray-700/50 w-fit"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">{currentServer.name}</h1>
          <p className="text-muted-foreground">
            {currentServer.plan} Plan - {currentServer.country}
          </p>
        </div>

        {/* Status Alerts */}
        {(serverStatus === "starting" || serverStatus === "stopping") && (
          <Alert className="border-warning bg-warning/10">
            <Clock className="h-4 w-4" />
            <AlertDescription>
              Server is {serverStatus}... Please wait a moment.
            </AlertDescription>
          </Alert>
        )}

        {/* Server Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Server Status
              </CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Badge
                  variant="outline"
                  className={getStatusColor(serverStatus)}
                >
                  {getStatusIcon(serverStatus)}
                  <span className="ml-1 capitalize">{serverStatus}</span>
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {currentServer.name.toLowerCase().replace(/\s+/g, "-")}
                .thlight.net:25565
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Players Online
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {currentServer.currentPlayers || 0}/
                {currentServer.playerSlots ||
                  currentServer.serverConfig?.slots ||
                  50000}
              </div>
              <p className="text-xs text-muted-foreground">+2 from last hour</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Server Version
              </CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentServer.version}</div>
              <p className="text-xs text-muted-foreground">Latest stable</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Uptime</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {serverStatus === "online" ? "2h 45m" : "0d 0h"}
              </div>
              <p className="text-xs text-muted-foreground">99.9% this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Server Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Server Controls</CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage your server's state
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => handleServerAction("start")}
                disabled={serverStatus === "online" || isLoading}
                className="bg-success hover:bg-success/90 text-success-foreground"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Server
              </Button>
              <Button
                onClick={() => handleServerAction("stop")}
                disabled={serverStatus === "offline" || isLoading}
                variant="destructive"
              >
                <Pause className="w-4 h-4 mr-2" />
                Stop Server
              </Button>
              <Button
                onClick={() => handleServerAction("restart")}
                disabled={serverStatus === "offline" || isLoading}
                variant="outline"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Restart Server
              </Button>

              <OptionsDialog
                isOpen={isOptionsOpen}
                onOpenChange={setIsOptionsOpen}
                serverSpecs={serverSpecs}
                setServerSpecs={setServerSpecs}
                currentPlan={currentPlan}
                serverConfig={currentServer?.serverConfig}
                onSave={handleSaveSpecs}
                onConfigSave={handleConfigSave}
              />

              <VersionSelector
                currentVersion={currentServer?.version || "1.21.4"}
                onVersionChange={handleVersionChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">RAM Usage</CardTitle>
              <MemoryStick className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {serverStatus === "offline"
                  ? "OFFLINE"
                  : `${serverSpecs.ram} GB`}
              </div>
              <Progress
                value={
                  serverStatus === "offline"
                    ? 0
                    : (serverSpecs.ram / currentPlan.maxRam) * 100
                }
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {serverSpecs.ram} GB of {currentPlan.maxRam} GB allocated
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
              <Cpu className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {serverStatus === "offline" ? "OFFLINE" : `${serverSpecs.cpu}%`}
              </div>
              <Progress
                value={serverStatus === "offline" ? 0 : serverSpecs.cpu}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {serverSpecs.cpu}% of {currentPlan.maxCpu}% allocated
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {serverStatus === "offline"
                  ? "OFFLINE"
                  : `${serverSpecs.disk} GB`}
              </div>
              <Progress
                value={
                  serverStatus === "offline"
                    ? 0
                    : (serverSpecs.disk / currentPlan.maxDisk) * 100
                }
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {serverSpecs.disk} GB of {currentPlan.maxDisk} GB allocated
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & TPS */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Server Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  TPS (Ticks Per Second)
                </span>
                <Badge variant="outline" className="bg-success/10 text-success">
                  {serverStatus === "online" ? "19.8 TPS" : "0 TPS"}
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Avg Ping</span>
                <span className="text-sm">
                  {serverStatus === "online" ? "45ms" : "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Loaded Chunks</span>
                <span className="text-sm">
                  {serverStatus === "online" ? "1,247" : "0"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Entities</span>
                <span className="text-sm">
                  {serverStatus === "online" ? "2,156" : "0"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Server {serverStatus}</p>
                    <p className="text-xs text-muted-foreground">
                      Server status changed to {serverStatus}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">now</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Resources updated</p>
                    <p className="text-xs text-muted-foreground">
                      Allocated {serverSpecs.ram}GB RAM, {serverSpecs.disk}GB
                      disk
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">5m ago</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      Plan: {currentPlan.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Current server plan details
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">1h ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
            <p className="text-sm text-muted-foreground">
              Jump to commonly used features
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Users className="h-6 w-6" />
                <span className="text-sm">Players</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Activity className="h-6 w-6" />
                <span className="text-sm">Logs</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <HardDrive className="h-6 w-6" />
                <span className="text-sm">Files</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Zap className="h-6 w-6" />
                <span className="text-sm">Plugins</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

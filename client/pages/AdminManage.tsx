import { useState, useEffect } from "react";
import {
  Shield,
  Server,
  Trash2,
  Ban,
  UserX,
  Gift,
  XCircle,
  Eye,
  EyeOff,
  Mail,
  Crown,
  Users,
  AlertTriangle,
  CheckCircle,
  Settings,
  Plus,
  Minus,
  Lock,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useServer } from "../contexts/ServerContext";

interface AdminAction {
  id: string;
  type:
    | "server_delete"
    | "server_ban"
    | "server_unban"
    | "email_ban"
    | "email_unban"
    | "premium_grant"
    | "premium_revoke";
  target: string;
  timestamp: number;
  adminEmail: string;
}

const serverPlans = [
  { id: "free", name: "Free" },
  { id: "basic", name: "Basic" },
  { id: "standard", name: "Standard" },
  { id: "premium", name: "Premium" },
  { id: "pro", name: "Pro" },
  { id: "ultimate", name: "Ultimate" },
  { id: "enterprise", name: "Enterprise" },
  { id: "infinity", name: "Infinity" },
];

export default function AdminManage() {
  const { servers, setServers, user, registeredUsers } = useServer();
  const [bannedServers, setBannedServers] = useState<number[]>([]);
  const [bannedEmails, setBannedEmails] = useState<string[]>([]);
  const [adminActions, setAdminActions] = useState<AdminAction[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<string>("");
  const [selectedPlan, setSelectedPlan] = useState<string>("basic");
  const [isGrantingPremium, setIsGrantingPremium] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [searchEmail, setSearchEmail] = useState<string>("");
  const [showUserCredentials, setShowUserCredentials] = useState(false);

  // Check if current user is the owner
  if (user?.email !== "kaverimaynale@gmail.com") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <Card className="max-w-md w-full bg-red-900/20 border-red-500">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-red-400 mb-2">
              Access Denied
            </h1>
            <p className="text-red-300 text-lg">
              YOU CAN'T HAVE PERMISSION TO OPEN THIS PAGE THIS PAGE IS ONLY FOR
              OWNER{" "}
              <span className="text-blue-400 font-bold animate-pulse drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">
                THLIGHT
              </span>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get all unique emails from servers
  const getAllEmails = () => {
    const emails = [...new Set(servers.map((server) => server.ownerEmail))];
    return emails.filter((email) => email && email !== "");
  };

  // Get servers by email
  const getServersByEmail = (email: string) => {
    return servers.filter((server) => server.ownerEmail === email);
  };

  // Admin actions
  const logAction = (type: AdminAction["type"], target: string) => {
    const newAction: AdminAction = {
      id: Date.now().toString(),
      type,
      target,
      timestamp: Date.now(),
      adminEmail: user?.email || "",
    };
    setAdminActions((prev) => [newAction, ...prev.slice(0, 49)]); // Keep last 50 actions
  };

  const deleteServer = (serverId: number) => {
    const server = servers.find((s) => s.id === serverId);
    if (server) {
      setServers((prev) => prev.filter((s) => s.id !== serverId));
      logAction("server_delete", `${server.name} (${server.ownerEmail})`);
      showMessage(`Server "${server.name}" deleted successfully`, "success");
    }
  };

  const banServer = (serverId: number) => {
    const server = servers.find((s) => s.id === serverId);
    if (server && !bannedServers.includes(serverId)) {
      setBannedServers((prev) => [...prev, serverId]);
      logAction("server_ban", `${server.name} (${server.ownerEmail})`);
      showMessage(`Server "${server.name}" banned successfully`, "success");
    }
  };

  const unbanServer = (serverId: number) => {
    const server = servers.find((s) => s.id === serverId);
    if (server && bannedServers.includes(serverId)) {
      setBannedServers((prev) => prev.filter((id) => id !== serverId));
      logAction("server_unban", `${server.name} (${server.ownerEmail})`);
      showMessage(`Server "${server.name}" unbanned successfully`, "success");
    }
  };

  const banEmail = (email: string) => {
    if (!bannedEmails.includes(email)) {
      setBannedEmails((prev) => [...prev, email]);
      logAction("email_ban", email);
      showMessage(`Email "${email}" banned successfully`, "success");
    }
  };

  const unbanEmail = (email: string) => {
    if (bannedEmails.includes(email)) {
      setBannedEmails((prev) => prev.filter((e) => e !== email));
      logAction("email_unban", email);
      showMessage(`Email "${email}" unbanned successfully`, "success");
    }
  };

  const grantPremiumServer = async () => {
    if (!selectedEmail || !selectedPlan) return;

    setIsGrantingPremium(true);
    try {
      const planData = serverPlans.find((p) => p.id === selectedPlan);
      if (!planData) return;

      const newServer = {
        id: Date.now(),
        name: `Premium ${planData.name} Server`,
        status: "offline" as const,
        players: "0/20",
        version: "1.21.4",
        plan: planData.name,
        planDetails: {
          ram:
            selectedPlan === "basic"
              ? 4
              : selectedPlan === "standard"
                ? 8
                : selectedPlan === "premium"
                  ? 16
                  : 32,
          disk:
            selectedPlan === "basic"
              ? 20
              : selectedPlan === "standard"
                ? 40
                : selectedPlan === "premium"
                  ? 80
                  : 160,
          cpu: 100,
        },
        country: "United States",
        ownerEmail: selectedEmail,
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
      logAction("premium_grant", `${planData.name} server to ${selectedEmail}`);
      showMessage(
        `${planData.name} server granted to ${selectedEmail}`,
        "success",
      );
      setSelectedEmail("");
      setSelectedPlan("basic");
    } finally {
      setIsGrantingPremium(false);
    }
  };

  const revokeServer = (serverId: number) => {
    const server = servers.find((s) => s.id === serverId);
    if (server) {
      setServers((prev) => prev.filter((s) => s.id !== serverId));
      logAction("premium_revoke", `${server.name} from ${server.ownerEmail}`);
      showMessage(
        `Server "${server.name}" revoked from ${server.ownerEmail}`,
        "success",
      );
    }
  };

  const showMessage = (msg: string, type: "success" | "error") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  const getActionIcon = (type: AdminAction["type"]) => {
    switch (type) {
      case "server_delete":
        return <Trash2 className="w-4 h-4 text-red-500" />;
      case "server_ban":
        return <Ban className="w-4 h-4 text-orange-500" />;
      case "server_unban":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "email_ban":
        return <UserX className="w-4 h-4 text-red-500" />;
      case "email_unban":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "premium_grant":
        return <Gift className="w-4 h-4 text-blue-500" />;
      case "premium_revoke":
        return <XCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <Settings className="w-4 h-4" />;
    }
  };

  const allEmails = getAllEmails();

  return (
    <div className="min-h-screen bg-gray-900 p-6">
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
        className="text-gray-300 hover:text-white hover:bg-gray-700/50 mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-red-400 flex items-center gap-3 mb-2">
          <Crown className="w-8 h-8" />
          THLIGHT Admin Panel
        </h1>
        <p className="text-gray-300">
          Owner: {user?.email} | Total Servers: {servers.length} | Total Users:{" "}
          {allEmails.length}
        </p>
      </div>

      {/* Message Alert */}
      {message && (
        <Alert
          className={`mb-6 ${messageType === "success" ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10"}`}
        >
          {messageType === "success" ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-red-500" />
          )}
          <AlertDescription
            className={
              messageType === "success" ? "text-green-500" : "text-red-500"
            }
          >
            {message}
          </AlertDescription>
        </Alert>
      )}

      {/* Grant Premium Server */}
      <Card className="mb-8 bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-400">
            <Gift className="w-5 h-5" />
            Grant Premium Server
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Enter Email</Label>
              <Input
                value={selectedEmail}
                onChange={(e) => setSelectedEmail(e.target.value)}
                placeholder="Type any email address..."
                className="bg-gray-700 border-gray-600 text-gray-200"
              />
            </div>
            <div className="space-y-2">
              <Label>Select Plan</Label>
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {serverPlans
                    .filter((p) => p.id !== "free")
                    .map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={grantPremiumServer}
                disabled={!selectedEmail || !selectedPlan || isGrantingPremium}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Gift className="w-4 h-4 mr-2" />
                {isGrantingPremium ? "Granting..." : "Grant Server"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Search & User Credentials */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Email Search */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-400">
              <Mail className="w-5 h-5" />
              Search User Servers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Enter Email to Search</Label>
              <Input
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                placeholder="user@gmail.com"
                className="bg-gray-700 border-gray-600 text-gray-200"
              />
            </div>

            {searchEmail && (
              <div className="mt-4">
                <h4 className="font-semibold text-white mb-2">
                  Servers for: {searchEmail}
                </h4>
                <div className="mb-2 text-xs text-gray-400 border border-gray-600 p-2 rounded">
                  <strong>Debug Info:</strong>
                  <br />• Total servers in system: {servers.length}
                  <br />• Servers for this email:{" "}
                  {getServersByEmail(searchEmail).length}
                  <br />• All server owner emails:{" "}
                  {servers.map((s) => s.ownerEmail).join(", ")}
                </div>
                {getServersByEmail(searchEmail).length === 0 ? (
                  <p className="text-gray-500 italic">
                    No servers found for this email
                  </p>
                ) : (
                  <div className="space-y-2">
                    {getServersByEmail(searchEmail).map((server) => (
                      <div
                        key={server.id}
                        className="p-3 bg-gray-700 rounded border border-gray-600"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-white">
                              {server.name}
                            </h5>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Badge variant="outline">{server.plan}</Badge>
                              <span>{server.version}</span>
                              <span>{server.players}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteServer(server.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Credentials */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-400">
              <Users className="w-5 h-5" />
              User Credentials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setShowUserCredentials(!showUserCredentials)}
              className="w-full bg-purple-600 hover:bg-purple-700 mb-4"
            >
              {showUserCredentials ? (
                <EyeOff className="w-4 h-4 mr-2" />
              ) : (
                <Eye className="w-4 h-4 mr-2" />
              )}
              {showUserCredentials ? "Hide" : "Show"} All User Credentials
            </Button>

            {showUserCredentials && (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {registeredUsers && registeredUsers.length > 0 ? (
                  registeredUsers.map((userData, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-700 rounded border border-gray-600"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-blue-400" />
                          <span className="font-medium text-white">
                            {userData.email}
                          </span>
                          {userData.email === "kaverimaynale@gmail.com" && (
                            <Badge className="bg-yellow-600">OWNER</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-300">
                            Username: {userData.username}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Lock className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-300">
                            Password: {userData.password}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">
                    No registered users found
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* User Management */}
      <div className="grid gap-6">
        {allEmails.map((email) => {
          const userServers = getServersByEmail(email);
          const isEmailBanned = bannedEmails.includes(email);
          const isOwner = email === "kaverimaynale@gmail.com";

          return (
            <Card
              key={email}
              className={`bg-gray-800 border-gray-700 ${isEmailBanned ? "border-red-500" : isOwner ? "border-yellow-500" : ""}`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${isOwner ? "bg-yellow-600" : isEmailBanned ? "bg-red-600" : "bg-blue-600"}`}
                    >
                      {isOwner ? (
                        <Crown className="w-6 h-6" />
                      ) : (
                        <Users className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        {email}
                        {isOwner && (
                          <Badge className="bg-yellow-600">OWNER</Badge>
                        )}
                        {isEmailBanned && (
                          <Badge variant="destructive">BANNED</Badge>
                        )}
                      </h3>
                      <p className="text-gray-400">
                        {userServers.length} server
                        {userServers.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isOwner && (
                      <>
                        {isEmailBanned ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => unbanEmail(email)}
                            className="border-green-500 text-green-500 hover:bg-green-500/10"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Unban Email
                          </Button>
                        ) : (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => banEmail(email)}
                          >
                            <UserX className="w-4 h-4 mr-2" />
                            Ban Email
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {userServers.length === 0 ? (
                    <p className="text-gray-500 italic">
                      No servers created yet
                    </p>
                  ) : (
                    <div className="grid gap-3">
                      {userServers.map((server) => {
                        const isServerBanned = bannedServers.includes(
                          server.id,
                        );
                        return (
                          <div
                            key={server.id}
                            className={`p-4 rounded-lg border ${isServerBanned ? "border-red-500 bg-red-500/10" : "border-gray-600 bg-gray-700"}`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Server className="w-5 h-5 text-gray-400" />
                                <div>
                                  <h4 className="font-semibold text-white">
                                    {server.name}
                                  </h4>
                                  <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <Badge variant="outline">
                                      {server.plan}
                                    </Badge>
                                    <span>{server.version}</span>
                                    <span>{server.players}</span>
                                    {isServerBanned && (
                                      <Badge variant="destructive">
                                        BANNED
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {isServerBanned ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => unbanServer(server.id)}
                                    className="border-green-500 text-green-500 hover:bg-green-500/10"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </Button>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => banServer(server.id)}
                                    className="border-orange-500 text-orange-500 hover:bg-orange-500/10"
                                  >
                                    <Ban className="w-4 h-4" />
                                  </Button>
                                )}

                                {server.plan !== "Free" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => revokeServer(server.id)}
                                    className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </Button>
                                )}

                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => deleteServer(server.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Actions */}
      {adminActions.length > 0 && (
        <Card className="mt-8 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-300">
              <Eye className="w-5 h-5" />
              Recent Admin Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {adminActions.slice(0, 10).map((action) => (
                <div
                  key={action.id}
                  className="flex items-center gap-3 p-2 bg-gray-700 rounded text-sm"
                >
                  {getActionIcon(action.type)}
                  <span className="text-gray-300">
                    {action.type.replace("_", " ").toUpperCase()}:{" "}
                    {action.target}
                  </span>
                  <span className="text-gray-500 ml-auto">
                    {new Date(action.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

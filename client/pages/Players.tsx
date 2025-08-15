import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Users,
  Crown,
  Shield,
  Ban,
  Plus,
  Settings,
  UserX,
  Sword,
  Package,
  Trash2,
  CheckCircle,
  AlertTriangle,
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useServer } from "../contexts/ServerContext";

interface Player {
  id: number;
  username: string;
  status: "online" | "offline";
  role: "player" | "op" | "admin";
  isWhitelisted: boolean;
  isBanned: boolean;
  lastSeen: string;
}

export default function Players() {
  // Use server context and URL params
  const { serverId } = useParams<{ serverId: string }>();
  const { getCurrentServer, getServerById, setCurrentServerId } = useServer();

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

  const [players, setPlayers] = useState<Player[]>([
    {
      id: 1,
      username: "Steve",
      status: "online",
      role: "player",
      isWhitelisted: true,
      isBanned: false,
      lastSeen: "Now",
    },
    {
      id: 2,
      username: "Alex",
      status: "online",
      role: "op",
      isWhitelisted: true,
      isBanned: false,
      lastSeen: "Now",
    },
    {
      id: 3,
      username: "Notch",
      status: "offline",
      role: "admin",
      isWhitelisted: true,
      isBanned: false,
      lastSeen: "2 hours ago",
    },
  ]);

  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [newUsername, setNewUsername] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showManageDialog, setShowManageDialog] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  const handleAddPlayer = () => {
    if (!newUsername.trim()) return;

    const newPlayer: Player = {
      id: Date.now(),
      username: newUsername,
      status: "offline",
      role: selectedAction === "op" ? "op" : "player",
      isWhitelisted: selectedAction === "whitelist" || selectedAction === "op",
      isBanned: selectedAction === "ban",
      lastSeen: "Never",
    };

    setPlayers((prev) => [...prev, newPlayer]);
    setActionMessage(
      `Player ${newUsername} ${
        selectedAction === "op"
          ? "added as OP"
          : selectedAction === "whitelist"
          ? "added to whitelist"
          : selectedAction === "ban"
          ? "banned"
          : "added"
      } successfully!`
    );
    setNewUsername("");
    setShowAddPlayer(false);
    setSelectedAction("");

    // Clear message after 3 seconds
    setTimeout(() => setActionMessage(""), 3000);
  };

  const handlePlayerAction = (action: string) => {
    if (!selectedPlayer) return;

    setPlayers((prev) =>
      prev.map((player) => {
        if (player.id === selectedPlayer.id) {
          switch (action) {
            case "ban":
              return { ...player, isBanned: true, status: "offline" as const };
            case "unban":
              return { ...player, isBanned: false };
            case "op":
              return { ...player, role: "op" as const, isWhitelisted: true };
            case "deop":
              return { ...player, role: "player" as const };
            case "whitelist":
              return { ...player, isWhitelisted: true };
            case "unwhitelist":
              return { ...player, isWhitelisted: false };
            case "kick":
              return { ...player, status: "offline" as const };
            case "kill":
              // Just a notification, doesn't change player state permanently
              setActionMessage(`${player.username} was killed!`);
              setTimeout(() => setActionMessage(""), 3000);
              return player;
            case "clear-inventory":
              setActionMessage(`${player.username}'s inventory cleared!`);
              setTimeout(() => setActionMessage(""), 3000);
              return player;
            default:
              return player;
          }
        }
        return player;
      })
    );

    if (action !== "kill" && action !== "clear-inventory") {
      setActionMessage(`${selectedPlayer.username} ${action} action completed!`);
      setTimeout(() => setActionMessage(""), 3000);
    }

    setShowManageDialog(false);
    setSelectedPlayer(null);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-destructive text-destructive-foreground";
      case "op":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    return status === "online"
      ? "bg-success text-success-foreground"
      : "bg-muted text-muted-foreground";
  };

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
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>

      {/* Content wrapper */}
      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">Player Management</h1>
          <p className="text-muted-foreground">
            Manage players for {currentServer?.name || "your server"}
          </p>
        </div>

        {/* Action Message */}
        {actionMessage && (
          <Alert className="border-success bg-success/10">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="text-success font-medium">
              {actionMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Add Player Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Player
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                variant={selectedAction === "op" ? "default" : "outline"}
                onClick={() => {
                  setSelectedAction("op");
                  setShowAddPlayer(true);
                }}
              >
                <Crown className="w-4 h-4 mr-2" />
                OP Player
              </Button>
              <Button
                variant={selectedAction === "whitelist" ? "default" : "outline"}
                onClick={() => {
                  setSelectedAction("whitelist");
                  setShowAddPlayer(true);
                }}
              >
                <Shield className="w-4 h-4 mr-2" />
                Whitelist Player
              </Button>
              <Button
                variant={selectedAction === "ban" ? "destructive" : "outline"}
                onClick={() => {
                  setSelectedAction("ban");
                  setShowAddPlayer(true);
                }}
              >
                <Ban className="w-4 h-4 mr-2" />
                Ban Player
              </Button>
            </div>

            {showAddPlayer && (
              <div className="space-y-4 p-4 border rounded-lg bg-card">
                <div className="space-y-2">
                  <Label htmlFor="username">USERNAME</Label>
                  <Input
                    id="username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Enter player username"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddPlayer} disabled={!newUsername.trim()}>
                    Add Player
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddPlayer(false);
                      setNewUsername("");
                      setSelectedAction("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Players List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Players ({players.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-card"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{player.username}</h3>
                        <Badge
                          variant="outline"
                          className={getRoleColor(player.role)}
                        >
                          {player.role.toUpperCase()}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={getStatusColor(player.status)}
                        >
                          {player.status}
                        </Badge>
                        {player.isWhitelisted && (
                          <Badge variant="outline" className="bg-blue-100 text-blue-800">
                            <Shield className="w-3 h-3 mr-1" />
                            Whitelisted
                          </Badge>
                        )}
                        {player.isBanned && (
                          <Badge variant="outline" className="bg-red-100 text-red-800">
                            <Ban className="w-3 h-3 mr-1" />
                            Banned
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Last seen: {player.lastSeen}
                      </p>
                    </div>
                  </div>
                  <Dialog
                    open={showManageDialog && selectedPlayer?.id === player.id}
                    onOpenChange={(open) => {
                      setShowManageDialog(open);
                      if (open) setSelectedPlayer(player);
                      else setSelectedPlayer(null);
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Manage Player
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Manage {player.username}</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-2">
                        {!player.isBanned ? (
                          <Button
                            variant="destructive"
                            onClick={() => handlePlayerAction("ban")}
                          >
                            <Ban className="w-4 h-4 mr-2" />
                            Ban Player
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            onClick={() => handlePlayerAction("unban")}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Unban Player
                          </Button>
                        )}

                        {player.role !== "op" ? (
                          <Button
                            variant="outline"
                            onClick={() => handlePlayerAction("op")}
                          >
                            <Crown className="w-4 h-4 mr-2" />
                            OP Player
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            onClick={() => handlePlayerAction("deop")}
                          >
                            <UserX className="w-4 h-4 mr-2" />
                            De-OP Player
                          </Button>
                        )}

                        {!player.isWhitelisted ? (
                          <Button
                            variant="outline"
                            onClick={() => handlePlayerAction("whitelist")}
                          >
                            <Shield className="w-4 h-4 mr-2" />
                            Whitelist Player
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            onClick={() => handlePlayerAction("unwhitelist")}
                          >
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Remove Whitelist
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          onClick={() => handlePlayerAction("clear-inventory")}
                        >
                          <Package className="w-4 h-4 mr-2" />
                          Clear Inventory
                        </Button>

                        <Button
                          variant="outline"
                          onClick={() => handlePlayerAction("kill")}
                        >
                          <Sword className="w-4 h-4 mr-2" />
                          Kill Player
                        </Button>

                        {player.status === "online" && (
                          <Button
                            variant="outline"
                            onClick={() => handlePlayerAction("kick")}
                          >
                            <UserX className="w-4 h-4 mr-2" />
                            Kick Player
                          </Button>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Total Players</span>
              </div>
              <div className="text-2xl font-bold">{players.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-sm font-medium">Online</span>
              </div>
              <div className="text-2xl font-bold">
                {players.filter((p) => p.status === "online").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-warning" />
                <span className="text-sm font-medium">OP Players</span>
              </div>
              <div className="text-2xl font-bold">
                {players.filter((p) => p.role === "op" || p.role === "admin").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Ban className="h-4 w-4 text-destructive" />
                <span className="text-sm font-medium">Banned</span>
              </div>
              <div className="text-2xl font-bold">
                {players.filter((p) => p.isBanned).length}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

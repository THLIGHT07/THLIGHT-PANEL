import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Save,
  Server,
  Globe,
  Shield,
  Users,
  Settings,
  Eye,
  Zap,
  AlertTriangle,
  CheckCircle,
  Info,
  Lock,
  Wifi,
  HardDrive,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useServer } from "../contexts/ServerContext";

export default function ServerSettings() {
  const { serverId } = useParams<{ serverId: string }>();
  const { getCurrentServer, getServerById, updateServerConfig, servers } = useServer();
  
  // Get current server
  const currentServer = serverId 
    ? getServerById(parseInt(serverId)) 
    : getCurrentServer();

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  // Basic Server Settings
  const [basicSettings, setBasicSettings] = useState({
    serverName: currentServer?.name || "",
    motd: "A Minecraft Server powered by THLIGHT",
    maxPlayers: currentServer?.serverConfig?.slots || 20,
    viewDistance: 10,
    simulationDistance: 10,
    serverPort: 25565,
    enableQuery: true,
    enableRcon: false,
    rconPassword: "",
  });

  // World Settings
  const [worldSettings, setWorldSettings] = useState({
    levelName: "world",
    levelSeed: "",
    levelType: "minecraft:normal",
    generateStructures: true,
    allowNether: true,
    allowEnd: true,
    spawnProtection: 16,
    forceGamemode: false,
    hardcore: false,
  });

  // Gameplay Settings
  const [gameplaySettings, setGameplaySettings] = useState({
    gamemode: currentServer?.serverConfig?.gamemode || "survival",
    difficulty: currentServer?.serverConfig?.difficulty || "normal",
    pvp: currentServer?.serverConfig?.pvp ?? true,
    commandBlocks: currentServer?.serverConfig?.commandblocks ?? true,
    allowFlight: currentServer?.serverConfig?.fly ?? true,
    spawnMonsters: currentServer?.serverConfig?.monster ?? true,
    spawnAnimals: true,
    spawnNpcs: true,
    announcePlayerAchievements: true,
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    whitelist: currentServer?.serverConfig?.whitelist ?? false,
    enforceWhitelist: false,
    onlineMode: true,
    preventProxyConnections: false,
    enableStatus: true,
    hideOnlinePlayers: false,
  });

  // Performance Settings
  const [performanceSettings, setPerformanceSettings] = useState({
    networkCompressionThreshold: 256,
    maxTickTime: 60000,
    maxWorldSize: 29999984,
    entityBroadcastRangePercentage: 100,
    functionPermissionLevel: 2,
    opPermissionLevel: 4,
  });

  // Load settings from server config
  useEffect(() => {
    if (currentServer?.serverConfig) {
      const config = currentServer.serverConfig;
      setBasicSettings(prev => ({
        ...prev,
        serverName: currentServer.name,
        maxPlayers: config.slots,
      }));
      setGameplaySettings(prev => ({
        ...prev,
        gamemode: config.gamemode.toLowerCase(),
        difficulty: config.difficulty.toLowerCase(),
        pvp: config.pvp,
        commandBlocks: config.commandblocks,
        allowFlight: config.fly,
        spawnMonsters: config.monster,
      }));
      setSecuritySettings(prev => ({
        ...prev,
        whitelist: config.whitelist,
      }));
    }
  }, [currentServer]);

  const handleSave = async () => {
    if (!currentServer) return;

    setIsSaving(true);
    setSaveMessage("");

    try {
      // Combine all settings
      const allSettings = {
        slots: basicSettings.maxPlayers,
        gamemode: gameplaySettings.gamemode,
        difficulty: gameplaySettings.difficulty,
        whitelist: securitySettings.whitelist,
        pvp: gameplaySettings.pvp,
        cracked: !securitySettings.onlineMode,
        commandblocks: gameplaySettings.commandBlocks,
        monster: gameplaySettings.spawnMonsters,
        fly: gameplaySettings.allowFlight,
        nether: worldSettings.allowNether,
        // Add all the new settings
        motd: basicSettings.motd,
        viewDistance: basicSettings.viewDistance,
        simulationDistance: basicSettings.simulationDistance,
        serverPort: basicSettings.serverPort,
        enableQuery: basicSettings.enableQuery,
        enableRcon: basicSettings.enableRcon,
        rconPassword: basicSettings.rconPassword,
        levelName: worldSettings.levelName,
        levelSeed: worldSettings.levelSeed,
        levelType: worldSettings.levelType,
        generateStructures: worldSettings.generateStructures,
        allowEnd: worldSettings.allowEnd,
        spawnProtection: worldSettings.spawnProtection,
        forceGamemode: worldSettings.forceGamemode,
        hardcore: worldSettings.hardcore,
        spawnAnimals: gameplaySettings.spawnAnimals,
        spawnNpcs: gameplaySettings.spawnNpcs,
        announcePlayerAchievements: gameplaySettings.announcePlayerAchievements,
        enforceWhitelist: securitySettings.enforceWhitelist,
        onlineMode: securitySettings.onlineMode,
        preventProxyConnections: securitySettings.preventProxyConnections,
        enableStatus: securitySettings.enableStatus,
        hideOnlinePlayers: securitySettings.hideOnlinePlayers,
        networkCompressionThreshold: performanceSettings.networkCompressionThreshold,
        maxTickTime: performanceSettings.maxTickTime,
        maxWorldSize: performanceSettings.maxWorldSize,
        entityBroadcastRangePercentage: performanceSettings.entityBroadcastRangePercentage,
        functionPermissionLevel: performanceSettings.functionPermissionLevel,
        opPermissionLevel: performanceSettings.opPermissionLevel,
      };

      // Save to server context
      updateServerConfig(currentServer.id, allSettings);

      // Simulate API save
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSaveMessage("Server settings saved successfully!");
      setMessageType("success");
      
      setTimeout(() => {
        setSaveMessage("");
        setMessageType("");
      }, 3000);

    } catch (error) {
      setSaveMessage("Error saving server settings. Please try again.");
      setMessageType("error");
    } finally {
      setIsSaving(false);
    }
  };

  if (!currentServer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <Server className="w-12 h-12 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">No Server Selected</h1>
        <p className="text-muted-foreground">Please select a server from the dashboard</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Settings className="w-8 h-8" />
              Server Settings
            </h1>
            <p className="text-muted-foreground">
              Configure your Minecraft server: {currentServer.name}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Server className="w-3 h-3" />
              {currentServer.plan} Plan
            </Badge>
            <Badge variant="secondary">
              {currentServer.version}
            </Badge>
          </div>
        </div>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <Alert className={`${messageType === "success" ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10"}`}>
          {messageType === "success" ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-red-500" />
          )}
          <AlertDescription className={messageType === "success" ? "text-green-500" : "text-red-500"}>
            {saveMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Settings Tabs */}
      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <Server className="w-4 h-4" />
            Basic
          </TabsTrigger>
          <TabsTrigger value="world" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            World
          </TabsTrigger>
          <TabsTrigger value="gameplay" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Gameplay
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Performance
          </TabsTrigger>
        </TabsList>

        {/* Basic Settings */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                Basic Server Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="serverName">Server Name</Label>
                  <Input
                    id="serverName"
                    value={basicSettings.serverName}
                    onChange={(e) => setBasicSettings(prev => ({ ...prev, serverName: e.target.value }))}
                    placeholder="My Minecraft Server"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxPlayers">Max Players</Label>
                  <Input
                    id="maxPlayers"
                    type="number"
                    value={basicSettings.maxPlayers}
                    onChange={(e) => setBasicSettings(prev => ({ ...prev, maxPlayers: parseInt(e.target.value) || 20 }))}
                    min="1"
                    max="1000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="motd">Message of the Day (MOTD)</Label>
                <Textarea
                  id="motd"
                  value={basicSettings.motd}
                  onChange={(e) => setBasicSettings(prev => ({ ...prev, motd: e.target.value }))}
                  placeholder="Welcome to my awesome Minecraft server!"
                  rows={2}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="viewDistance">View Distance</Label>
                  <Select
                    value={basicSettings.viewDistance.toString()}
                    onValueChange={(value) => setBasicSettings(prev => ({ ...prev, viewDistance: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[2, 4, 6, 8, 10, 12, 16, 20, 24, 32].map(distance => (
                        <SelectItem key={distance} value={distance.toString()}>
                          {distance} chunks
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="simulationDistance">Simulation Distance</Label>
                  <Select
                    value={basicSettings.simulationDistance.toString()}
                    onValueChange={(value) => setBasicSettings(prev => ({ ...prev, simulationDistance: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[2, 4, 6, 8, 10, 12, 16].map(distance => (
                        <SelectItem key={distance} value={distance.toString()}>
                          {distance} chunks
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serverPort">Server Port</Label>
                  <Input
                    id="serverPort"
                    type="number"
                    value={basicSettings.serverPort}
                    onChange={(e) => setBasicSettings(prev => ({ ...prev, serverPort: parseInt(e.target.value) || 25565 }))}
                    min="1"
                    max="65535"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-semibold">Network Settings</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Query</Label>
                      <p className="text-xs text-muted-foreground">Allow server status queries</p>
                    </div>
                    <Switch
                      checked={basicSettings.enableQuery}
                      onCheckedChange={(checked) => setBasicSettings(prev => ({ ...prev, enableQuery: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable RCON</Label>
                      <p className="text-xs text-muted-foreground">Remote console access</p>
                    </div>
                    <Switch
                      checked={basicSettings.enableRcon}
                      onCheckedChange={(checked) => setBasicSettings(prev => ({ ...prev, enableRcon: checked }))}
                    />
                  </div>
                </div>
                {basicSettings.enableRcon && (
                  <div className="space-y-2">
                    <Label htmlFor="rconPassword">RCON Password</Label>
                    <Input
                      id="rconPassword"
                      type="password"
                      value={basicSettings.rconPassword}
                      onChange={(e) => setBasicSettings(prev => ({ ...prev, rconPassword: e.target.value }))}
                      placeholder="Enter secure password"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* World Settings */}
        <TabsContent value="world" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                World Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="levelName">World Name</Label>
                  <Input
                    id="levelName"
                    value={worldSettings.levelName}
                    onChange={(e) => setWorldSettings(prev => ({ ...prev, levelName: e.target.value }))}
                    placeholder="world"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="levelSeed">World Seed</Label>
                  <Input
                    id="levelSeed"
                    value={worldSettings.levelSeed}
                    onChange={(e) => setWorldSettings(prev => ({ ...prev, levelSeed: e.target.value }))}
                    placeholder="Leave empty for random"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="levelType">World Type</Label>
                <Select
                  value={worldSettings.levelType}
                  onValueChange={(value) => setWorldSettings(prev => ({ ...prev, levelType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minecraft:normal">Normal</SelectItem>
                    <SelectItem value="minecraft:flat">Superflat</SelectItem>
                    <SelectItem value="minecraft:large_biomes">Large Biomes</SelectItem>
                    <SelectItem value="minecraft:amplified">Amplified</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="spawnProtection">Spawn Protection Radius</Label>
                <Input
                  id="spawnProtection"
                  type="number"
                  value={worldSettings.spawnProtection}
                  onChange={(e) => setWorldSettings(prev => ({ ...prev, spawnProtection: parseInt(e.target.value) || 16 }))}
                  min="0"
                  max="100"
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-semibold">World Features</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center justify-between">
                    <Label>Generate Structures</Label>
                    <Switch
                      checked={worldSettings.generateStructures}
                      onCheckedChange={(checked) => setWorldSettings(prev => ({ ...prev, generateStructures: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Allow Nether</Label>
                    <Switch
                      checked={worldSettings.allowNether}
                      onCheckedChange={(checked) => setWorldSettings(prev => ({ ...prev, allowNether: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Allow End</Label>
                    <Switch
                      checked={worldSettings.allowEnd}
                      onCheckedChange={(checked) => setWorldSettings(prev => ({ ...prev, allowEnd: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Force Gamemode</Label>
                    <Switch
                      checked={worldSettings.forceGamemode}
                      onCheckedChange={(checked) => setWorldSettings(prev => ({ ...prev, forceGamemode: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Hardcore Mode</Label>
                    <Switch
                      checked={worldSettings.hardcore}
                      onCheckedChange={(checked) => setWorldSettings(prev => ({ ...prev, hardcore: checked }))}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gameplay Settings */}
        <TabsContent value="gameplay" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Gameplay Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="gamemode">Default Gamemode</Label>
                  <Select
                    value={gameplaySettings.gamemode}
                    onValueChange={(value) => setGameplaySettings(prev => ({ ...prev, gamemode: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="survival">Survival</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                      <SelectItem value="adventure">Adventure</SelectItem>
                      <SelectItem value="spectator">Spectator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select
                    value={gameplaySettings.difficulty}
                    onValueChange={(value) => setGameplaySettings(prev => ({ ...prev, difficulty: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="peaceful">Peaceful</SelectItem>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-semibold">Gameplay Features</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center justify-between">
                    <Label>Player vs Player (PVP)</Label>
                    <Switch
                      checked={gameplaySettings.pvp}
                      onCheckedChange={(checked) => setGameplaySettings(prev => ({ ...prev, pvp: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Command Blocks</Label>
                    <Switch
                      checked={gameplaySettings.commandBlocks}
                      onCheckedChange={(checked) => setGameplaySettings(prev => ({ ...prev, commandBlocks: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Allow Flight</Label>
                    <Switch
                      checked={gameplaySettings.allowFlight}
                      onCheckedChange={(checked) => setGameplaySettings(prev => ({ ...prev, allowFlight: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Spawn Monsters</Label>
                    <Switch
                      checked={gameplaySettings.spawnMonsters}
                      onCheckedChange={(checked) => setGameplaySettings(prev => ({ ...prev, spawnMonsters: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Spawn Animals</Label>
                    <Switch
                      checked={gameplaySettings.spawnAnimals}
                      onCheckedChange={(checked) => setGameplaySettings(prev => ({ ...prev, spawnAnimals: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Spawn NPCs</Label>
                    <Switch
                      checked={gameplaySettings.spawnNpcs}
                      onCheckedChange={(checked) => setGameplaySettings(prev => ({ ...prev, spawnNpcs: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Announce Achievements</Label>
                    <Switch
                      checked={gameplaySettings.announcePlayerAchievements}
                      onCheckedChange={(checked) => setGameplaySettings(prev => ({ ...prev, announcePlayerAchievements: checked }))}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold">Access Control</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Whitelist</Label>
                      <p className="text-xs text-muted-foreground">Only whitelisted players can join</p>
                    </div>
                    <Switch
                      checked={securitySettings.whitelist}
                      onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, whitelist: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enforce Whitelist</Label>
                      <p className="text-xs text-muted-foreground">Remove non-whitelisted players</p>
                    </div>
                    <Switch
                      checked={securitySettings.enforceWhitelist}
                      onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, enforceWhitelist: checked }))}
                      disabled={!securitySettings.whitelist}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Online Mode</Label>
                      <p className="text-xs text-muted-foreground">Verify player accounts with Mojang</p>
                    </div>
                    <Switch
                      checked={securitySettings.onlineMode}
                      onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, onlineMode: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Prevent Proxy Connections</Label>
                      <p className="text-xs text-muted-foreground">Block VPN/proxy connections</p>
                    </div>
                    <Switch
                      checked={securitySettings.preventProxyConnections}
                      onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, preventProxyConnections: checked }))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-semibold">Server Visibility</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Status</Label>
                      <p className="text-xs text-muted-foreground">Show server in server list</p>
                    </div>
                    <Switch
                      checked={securitySettings.enableStatus}
                      onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, enableStatus: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Hide Online Players</Label>
                      <p className="text-xs text-muted-foreground">Hide player names in status</p>
                    </div>
                    <Switch
                      checked={securitySettings.hideOnlinePlayers}
                      onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, hideOnlinePlayers: checked }))}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Settings */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Performance Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="networkCompression">Network Compression Threshold</Label>
                  <Input
                    id="networkCompression"
                    type="number"
                    value={performanceSettings.networkCompressionThreshold}
                    onChange={(e) => setPerformanceSettings(prev => ({ ...prev, networkCompressionThreshold: parseInt(e.target.value) || 256 }))}
                    min="0"
                    max="1024"
                  />
                  <p className="text-xs text-muted-foreground">
                    Packets larger than this will be compressed (bytes)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxTickTime">Max Tick Time</Label>
                  <Input
                    id="maxTickTime"
                    type="number"
                    value={performanceSettings.maxTickTime}
                    onChange={(e) => setPerformanceSettings(prev => ({ ...prev, maxTickTime: parseInt(e.target.value) || 60000 }))}
                    min="1000"
                    max="300000"
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum time for a single tick (milliseconds)
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="entityBroadcast">Entity Broadcast Range</Label>
                  <Input
                    id="entityBroadcast"
                    type="number"
                    value={performanceSettings.entityBroadcastRangePercentage}
                    onChange={(e) => setPerformanceSettings(prev => ({ ...prev, entityBroadcastRangePercentage: parseInt(e.target.value) || 100 }))}
                    min="10"
                    max="1000"
                  />
                  <p className="text-xs text-muted-foreground">
                    Percentage of view distance for entity updates
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxWorldSize">Max World Size</Label>
                  <Input
                    id="maxWorldSize"
                    type="number"
                    value={performanceSettings.maxWorldSize}
                    onChange={(e) => setPerformanceSettings(prev => ({ ...prev, maxWorldSize: parseInt(e.target.value) || 29999984 }))}
                    min="1000"
                    max="29999984"
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum radius for new chunks (blocks)
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-semibold">Permission Levels</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="functionPermission">Function Permission Level</Label>
                    <Select
                      value={performanceSettings.functionPermissionLevel.toString()}
                      onValueChange={(value) => setPerformanceSettings(prev => ({ ...prev, functionPermissionLevel: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - Moderate</SelectItem>
                        <SelectItem value="2">2 - GameMaster</SelectItem>
                        <SelectItem value="3">3 - Admin</SelectItem>
                        <SelectItem value="4">4 - Owner</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="opPermission">OP Permission Level</Label>
                    <Select
                      value={performanceSettings.opPermissionLevel.toString()}
                      onValueChange={(value) => setPerformanceSettings(prev => ({ ...prev, opPermissionLevel: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - Moderate</SelectItem>
                        <SelectItem value="2">2 - GameMaster</SelectItem>
                        <SelectItem value="3">3 - Admin</SelectItem>
                        <SelectItem value="4">4 - Owner</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="min-w-[150px]"
          >
            {isSaving ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save All Settings
              </>
            )}
          </Button>
        </div>
      </Tabs>
    </div>
  );
}

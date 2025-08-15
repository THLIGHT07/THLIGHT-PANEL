import { useState } from "react";
import {
  Settings,
  Save,
  Plus,
  Minus,
  MemoryStick,
  HardDrive,
  Cpu,
  Users,
  Shield,
  Sword,
  Crown,
  Globe,
  Target,
  Zap,
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

interface OptionsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  serverSpecs: {
    ram: number;
    disk: number;
    cpu: number;
  };
  setServerSpecs: React.Dispatch<
    React.SetStateAction<{
      ram: number;
      disk: number;
      cpu: number;
    }>
  >;
  currentPlan: {
    name: string;
    maxRam: number;
    maxDisk: number;
    maxCpu: number;
  };
  serverConfig?: {
    slots: number;
    gamemode: string;
    difficulty: string;
    whitelist: boolean;
    pvp: boolean;
    cracked: boolean;
    commandblocks: boolean;
    monster: boolean;
    fly: boolean;
    nether: boolean;
  };
  onSave: () => void;
  onConfigSave?: (config: any) => void;
}

export function OptionsDialog({
  isOpen,
  onOpenChange,
  serverSpecs,
  setServerSpecs,
  currentPlan,
  serverConfig: initialServerConfig,
  onSave,
  onConfigSave,
}: OptionsDialogProps) {
  // Server configuration settings
  const [serverConfig, setServerConfig] = useState(
    initialServerConfig || {
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
  );

  const handleSaveAll = () => {
    onSave(); // Save specs
    if (onConfigSave) {
      onConfigSave(serverConfig); // Save config
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Settings className="w-4 h-4 mr-2" />
          OPTIONS
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Server Management Options</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {currentPlan.name} Plan Limits & Server Configuration
          </p>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Resource Management Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2">
              Resource Management
            </h3>

            {/* RAM Management */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <MemoryStick className="w-4 h-4" />
                RAM (GB)
              </Label>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setServerSpecs((prev) => ({
                      ...prev,
                      ram: Math.max(0, prev.ram - 1),
                    }))
                  }
                  disabled={serverSpecs.ram <= 0}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Input
                  type="number"
                  value={serverSpecs.ram}
                  onChange={(e) =>
                    setServerSpecs((prev) => ({
                      ...prev,
                      ram: Math.min(
                        currentPlan.maxRam,
                        Math.max(0, parseInt(e.target.value) || 0),
                      ),
                    }))
                  }
                  className="text-center"
                  min="0"
                  max={currentPlan.maxRam}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setServerSpecs((prev) => ({
                      ...prev,
                      ram: Math.min(currentPlan.maxRam, prev.ram + 1),
                    }))
                  }
                  disabled={serverSpecs.ram >= currentPlan.maxRam}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-xs text-muted-foreground">
                Allocated: {serverSpecs.ram} GB / Max: {currentPlan.maxRam} GB (
                {currentPlan.name} Plan)
              </div>
            </div>

            {/* Disk Management */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <HardDrive className="w-4 h-4" />
                Disk Space (GB)
              </Label>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setServerSpecs((prev) => ({
                      ...prev,
                      disk: Math.max(0, prev.disk - 1),
                    }))
                  }
                  disabled={serverSpecs.disk <= 0}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Input
                  type="number"
                  value={serverSpecs.disk}
                  onChange={(e) =>
                    setServerSpecs((prev) => ({
                      ...prev,
                      disk: Math.min(
                        currentPlan.maxDisk,
                        Math.max(0, parseInt(e.target.value) || 0),
                      ),
                    }))
                  }
                  className="text-center"
                  min="0"
                  max={currentPlan.maxDisk}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setServerSpecs((prev) => ({
                      ...prev,
                      disk: Math.min(currentPlan.maxDisk, prev.disk + 1),
                    }))
                  }
                  disabled={serverSpecs.disk >= currentPlan.maxDisk}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-xs text-muted-foreground">
                Allocated: {serverSpecs.disk} GB / Max: {currentPlan.maxDisk} GB
                ({currentPlan.name} Plan)
              </div>
            </div>

            {/* CPU Management */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                CPU (%)
              </Label>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setServerSpecs((prev) => ({
                      ...prev,
                      cpu: Math.max(0, prev.cpu - 10),
                    }))
                  }
                  disabled={serverSpecs.cpu <= 0}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Input
                  type="number"
                  value={serverSpecs.cpu}
                  onChange={(e) =>
                    setServerSpecs((prev) => ({
                      ...prev,
                      cpu: Math.min(
                        currentPlan.maxCpu,
                        Math.max(0, parseInt(e.target.value) || 0),
                      ),
                    }))
                  }
                  className="text-center"
                  min="0"
                  max={currentPlan.maxCpu}
                  step="10"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setServerSpecs((prev) => ({
                      ...prev,
                      cpu: Math.min(currentPlan.maxCpu, prev.cpu + 10),
                    }))
                  }
                  disabled={serverSpecs.cpu >= currentPlan.maxCpu}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-xs text-muted-foreground">
                Allocated: {serverSpecs.cpu}% / Max: {currentPlan.maxCpu}% (
                {currentPlan.name} Plan)
              </div>
            </div>
          </div>

          {/* Server Configuration Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2">
              Server Configuration
            </h3>

            {/* Player Slots */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Player Slots
              </Label>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setServerConfig((prev) => ({
                      ...prev,
                      slots: Math.max(1, prev.slots - 5),
                    }))
                  }
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Input
                  type="number"
                  value={serverConfig.slots}
                  onChange={(e) =>
                    setServerConfig((prev) => ({
                      ...prev,
                      slots: Math.max(1, parseInt(e.target.value) || 1),
                    }))
                  }
                  className="text-center w-20"
                  min="1"
                  max="1000"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setServerConfig((prev) => ({
                      ...prev,
                      slots: prev.slots + 5,
                    }))
                  }
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Gamemode */}
            <div className="space-y-3">
              <Label>Gamemode</Label>
              <div className="grid grid-cols-2 gap-2">
                {["Survival", "Creative", "Adventure", "Spectator"].map(
                  (mode) => (
                    <Button
                      key={mode}
                      variant={
                        serverConfig.gamemode === mode ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        setServerConfig((prev) => ({ ...prev, gamemode: mode }))
                      }
                    >
                      {mode}
                    </Button>
                  ),
                )}
              </div>
            </div>

            {/* Difficulty */}
            <div className="space-y-3">
              <Label>Difficulty</Label>
              <div className="grid grid-cols-2 gap-2">
                {["Peaceful", "Easy", "Normal", "Hard"].map((diff) => (
                  <Button
                    key={diff}
                    variant={
                      serverConfig.difficulty === diff ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      setServerConfig((prev) => ({ ...prev, difficulty: diff }))
                    }
                  >
                    {diff}
                  </Button>
                ))}
              </div>
            </div>

            {/* Toggle Options */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm font-medium">Whitelist</span>
                  </div>
                  <Button
                    size="sm"
                    variant={serverConfig.whitelist ? "default" : "outline"}
                    onClick={() =>
                      setServerConfig((prev) => ({
                        ...prev,
                        whitelist: !prev.whitelist,
                      }))
                    }
                  >
                    {serverConfig.whitelist ? "ON" : "OFF"}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Sword className="w-4 h-4" />
                    <span className="text-sm font-medium">PVP</span>
                  </div>
                  <Button
                    size="sm"
                    variant={serverConfig.pvp ? "default" : "outline"}
                    onClick={() =>
                      setServerConfig((prev) => ({ ...prev, pvp: !prev.pvp }))
                    }
                  >
                    {serverConfig.pvp ? "ON" : "OFF"}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    <span className="text-sm font-medium">Command Blocks</span>
                  </div>
                  <Button
                    size="sm"
                    variant={serverConfig.commandblocks ? "default" : "outline"}
                    onClick={() =>
                      setServerConfig((prev) => ({
                        ...prev,
                        commandblocks: !prev.commandblocks,
                      }))
                    }
                  >
                    {serverConfig.commandblocks ? "ON" : "OFF"}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Monster Spawning
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant={serverConfig.monster ? "default" : "outline"}
                    onClick={() =>
                      setServerConfig((prev) => ({
                        ...prev,
                        monster: !prev.monster,
                      }))
                    }
                  >
                    {serverConfig.monster ? "ON" : "OFF"}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm font-medium">Flight</span>
                  </div>
                  <Button
                    size="sm"
                    variant={serverConfig.fly ? "default" : "outline"}
                    onClick={() =>
                      setServerConfig((prev) => ({ ...prev, fly: !prev.fly }))
                    }
                  >
                    {serverConfig.fly ? "ON" : "OFF"}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span className="text-sm font-medium">Nether</span>
                  </div>
                  <Button
                    size="sm"
                    variant={serverConfig.nether ? "default" : "outline"}
                    onClick={() =>
                      setServerConfig((prev) => ({
                        ...prev,
                        nether: !prev.nether,
                      }))
                    }
                  >
                    {serverConfig.nether ? "ON" : "OFF"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button - Full Width */}
          <div className="md:col-span-2">
            <Button onClick={handleSaveAll} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save All Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

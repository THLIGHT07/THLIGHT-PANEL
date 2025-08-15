import { useState } from "react";
import { Download, Package, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface VersionSelectorProps {
  currentVersion: string;
  onVersionChange: (version: string, type: "vanilla" | "bukkit") => void;
}

const minecraftVersions = [
  { version: "1.21.4", release: "Latest", recommended: true },
  { version: "1.21.3", release: "Stable" },
  { version: "1.21.2", release: "Stable" },
  { version: "1.21.1", release: "Stable" },
  { version: "1.21.0", release: "Stable" },
  { version: "1.20.6", release: "LTS" },
  { version: "1.20.4", release: "Popular" },
  { version: "1.20.2", release: "Stable" },
  { version: "1.20.1", release: "LTS" },
  { version: "1.19.4", release: "Legacy" },
  { version: "1.19.2", release: "Legacy" },
  { version: "1.18.2", release: "Legacy" },
  { version: "1.17.1", release: "Legacy" },
  { version: "1.16.5", release: "Legacy" },
  { version: "1.12.2", release: "Classic" },
  { version: "1.8.9", release: "Classic" },
];

export function VersionSelector({
  currentVersion,
  onVersionChange,
}: VersionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadMessage, setDownloadMessage] = useState("");

  const handleVersionSelect = (version: string) => {
    setSelectedVersion(version);
    setDownloadMessage("");
  };

  const handleDownload = async (type: "vanilla" | "bukkit") => {
    if (!selectedVersion) return;

    setIsDownloading(true);
    setDownloadMessage(`Downloading ${type} ${selectedVersion}...`);

    // Simulate download process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Update server version
    onVersionChange(selectedVersion, type);

    setDownloadMessage(`✅ Successfully installed ${type} ${selectedVersion}!`);
    setIsDownloading(false);

    // Close dialog after success
    setTimeout(() => {
      setIsOpen(false);
      setSelectedVersion(null);
      setDownloadMessage("");
    }, 2000);
  };

  const getBadgeVariant = (release: string) => {
    switch (release) {
      case "Latest":
        return "default";
      case "LTS":
        return "secondary";
      case "Popular":
        return "outline";
      case "Stable":
        return "outline";
      case "Legacy":
        return "secondary";
      case "Classic":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Package className="w-4 h-4 mr-2" />
          VERSION
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Minecraft Version</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Current Version: {currentVersion} | Choose a version and server type
          </p>
        </DialogHeader>

        {downloadMessage && (
          <Alert
            className={
              downloadMessage.includes("✅")
                ? "border-green-500 bg-green-500/10"
                : "border-blue-500 bg-blue-500/10"
            }
          >
            {downloadMessage.includes("✅") ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-blue-500" />
            )}
            <AlertDescription
              className={
                downloadMessage.includes("✅")
                  ? "text-green-500"
                  : "text-blue-400"
              }
            >
              {downloadMessage}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4">
          {/* Version Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Available Versions</h3>
            <div className="grid gap-2 max-h-64 overflow-y-auto">
              {minecraftVersions.map((versionData) => (
                <Card
                  key={versionData.version}
                  className={`cursor-pointer transition-all ${
                    selectedVersion === versionData.version
                      ? "ring-2 ring-primary border-primary"
                      : "hover:shadow-md"
                  }`}
                  onClick={() => handleVersionSelect(versionData.version)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-lg">
                          {versionData.version}
                        </span>
                        <Badge variant={getBadgeVariant(versionData.release)}>
                          {versionData.release}
                        </Badge>
                        {versionData.recommended && (
                          <Badge variant="default" className="bg-green-600">
                            Recommended
                          </Badge>
                        )}
                      </div>
                      {currentVersion === versionData.version && (
                        <Badge
                          variant="outline"
                          className="border-green-500 text-green-600"
                        >
                          Current
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Server Type Selection */}
          {selectedVersion && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-semibold">Choose Server Type</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {/* Vanilla */}
                <Card className="hover:shadow-md transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Vanilla
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Official Minecraft server software. Pure vanilla
                      experience without plugins.
                    </p>
                    <ul className="text-sm space-y-1">
                      <li>• Pure Minecraft experience</li>
                      <li>• No plugin support</li>
                      <li>• Official Mojang release</li>
                      <li>• Best performance</li>
                    </ul>
                    <Button
                      onClick={() => handleDownload("vanilla")}
                      disabled={isDownloading}
                      className="w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {isDownloading
                        ? "Installing..."
                        : `Install Vanilla ${selectedVersion}`}
                    </Button>
                  </CardContent>
                </Card>

                {/* Bukkit */}
                <Card className="hover:shadow-md transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Bukkit/Spigot
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Modified server with plugin support. Enhanced features and
                      customization.
                    </p>
                    <ul className="text-sm space-y-1">
                      <li>• Plugin support</li>
                      <li>• Enhanced performance</li>
                      <li>• More configuration options</li>
                      <li>• Community features</li>
                    </ul>
                    <Button
                      onClick={() => handleDownload("bukkit")}
                      disabled={isDownloading}
                      className="w-full"
                      variant="secondary"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {isDownloading
                        ? "Installing..."
                        : `Install Bukkit ${selectedVersion}`}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

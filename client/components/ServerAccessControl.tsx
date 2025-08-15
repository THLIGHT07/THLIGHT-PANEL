import { ReactNode } from "react";
import { useParams } from "react-router-dom";
import { useServer } from "../contexts/ServerContext";
import { Shield, Ban, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ServerAccessControlProps {
  children: ReactNode;
}

export function ServerAccessControl({ children }: ServerAccessControlProps) {
  const { serverId } = useParams<{ serverId: string }>();
  const { getCurrentServer, getServerById, isServerBanned, user } = useServer();
  
  // Get current server
  const currentServer = serverId 
    ? getServerById(parseInt(serverId)) 
    : getCurrentServer();

  // If no server, show children (will be handled by individual components)
  if (!currentServer) {
    return <>{children}</>;
  }

  // Check if server is banned
  const serverBanned = isServerBanned(currentServer.id);
  
  // Owner can always access
  if (user?.email === "kaverimaynale@gmail.com") {
    return <>{children}</>;
  }

  // If server is banned, show access denied
  if (serverBanned) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <Card className="max-w-md w-full bg-red-900/20 border-red-500">
          <CardContent className="p-8 text-center">
            <Ban className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-red-400 mb-2">Server Banned</h1>
            <p className="text-red-300 text-lg mb-4">
              This server has been temporarily suspended by the administrator.
            </p>
            <p className="text-red-300">
              Server: <span className="font-semibold">{currentServer.name}</span>
            </p>
            <p className="text-red-300">
              Contact support if you believe this is an error.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If server is not owned by current user, check access
  if (currentServer.ownerEmail !== user?.email) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <Card className="max-w-md w-full bg-orange-900/20 border-orange-500">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 mx-auto text-orange-500 mb-4" />
            <h1 className="text-2xl font-bold text-orange-400 mb-2">Access Denied</h1>
            <p className="text-orange-300 text-lg mb-4">
              You don't have permission to access this server.
            </p>
            <p className="text-orange-300">
              Server: <span className="font-semibold">{currentServer.name}</span>
            </p>
            <p className="text-orange-300">
              Owner: <span className="font-semibold">{currentServer.ownerEmail}</span>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User has access, render children
  return <>{children}</>;
}

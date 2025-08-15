import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ServerLimitWarningProps {
  onClose?: () => void;
}

export function ServerLimitWarning({ onClose }: ServerLimitWarningProps) {
  return (
    <Alert className="border-orange-500 bg-orange-500/10 mb-6">
      <AlertTriangle className="h-4 w-4 text-orange-500" />
      <AlertDescription className="flex items-center justify-between">
        <span className="text-orange-500 font-medium">
          YOUR FREE SERVER LIMIT IS REACHED. YOU CAN ONLY HAVE 1 FREE SERVER. UPGRADE TO A PAID PLAN TO CREATE MORE SERVERS.
        </span>
        {onClose && (
          <Button
            size="sm"
            variant="outline"
            onClick={onClose}
            className="ml-4 border-orange-500 text-orange-500 hover:bg-orange-500/10"
          >
            Close
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
